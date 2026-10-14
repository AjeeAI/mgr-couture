"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createBrowserClient } from '@supabase/ssr';
import ActionModal from "@/components/ui/ActionModal";

type CatalogItem = {
  id: string;
  sku: string;
  title: string;
  category: string;
  images: string[];
  description: string;
  price?: string;
};

type ImageItem = {
  id: string;
  url: string;
  file?: File;
};

export default function AdminCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // Form states
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Gowns");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  // Multiple image handling & previews
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom Action Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'success' | 'error' | 'loading';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    let ignore = false;

    const loadCatalog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ignore) {
        if (error) {
          console.error("Error fetching catalog:", error);
        } else {
          setItems(data || []);
        }
        setLoading(false);
      }
    };

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [supabase, refreshKey]);

  // Handle multiple file selections and create preview blobs
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newItems: ImageItem[] = files.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newItems]);
    }
  };

  // Add a single URL to the preview list
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: trimmed,
      },
    ]);
    setUrlInput("");
  };

  // Trigger confirmation modal before removing an image preview
  const confirmRemoveImage = (index: number) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Remove Lookbook Image',
      message: `Are you sure you want to remove image #${index + 1} from this garment's set?`,
      onConfirm: () => {
        setImages((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  // Auto-generate SKU when category changes
  const generateSku = (selectedCategory: string) => {
    const prefixMap: Record<string, string> = {
      Gowns: "MGR-EVN",
      Suits: "MGR-MN",
      Traditional: "MGR-TRD",
    };
    const prefix = prefixMap[selectedCategory] || "MGR-CST";
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${randomSuffix}`;
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (!editingId) {
      setSku(generateSku(newCategory));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are missing.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to upload image to Cloudinary.");
    }

    return data.secure_url;
  };

  const openCreateModal = () => {
    setEditingId(null);
    const initialCategory = "Gowns";
    setCategory(initialCategory);
    setSku(generateSku(initialCategory));
    setTitle("");
    setDescription("");
    setPrice("");
    setImages([]);
    setUrlInput("");
    setUploadMode("file");
    setIsModalOpen(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setEditingId(item.id);
    setSku(item.sku);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description || "");
    setPrice(item.price || "");
    setImages(
      (item.images || []).map((url, idx) => ({
        id: `existing-${idx}-${url}`,
        url,
      }))
    );
    setUrlInput("");
    setUploadMode("file");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (images.length === 0) {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Missing Images',
          message: 'Please provide at least one image file or valid URL before saving.',
        });
        setSubmitting(false);
        return;
      }

      const filesToUpload = images.filter((img) => img.file);
      if (filesToUpload.length > 0) {
        setUploadingImage(true);
      }

      // Single pass: upload new files to Cloudinary once, keep existing URLs
      const resolvedImages: string[] = [];
      for (const img of images) {
        if (img.file) {
          const uploadedUrl = await uploadToCloudinary(img.file);
          resolvedImages.push(uploadedUrl);
        } else if (img.url.startsWith("http")) {
          resolvedImages.push(img.url);
        }
      }

      setUploadingImage(false);

      if (resolvedImages.length === 0) {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Missing Images',
          message: 'Please provide at least one valid image file or URL before saving.',
        });
        setSubmitting(false);
        return;
      }

      const itemData = {
        sku,
        title,
        category,
        images: resolvedImages,
        description,
        price,
      };

      let error;
      if (editingId) {
        const res = await supabase.from('catalog_items').update(itemData).eq('id', editingId);
        error = res.error;
      } else {
        const res = await supabase.from('catalog_items').insert([itemData]);
        error = res.error;
      }

      if (error) throw new Error(error.message);

      setIsModalOpen(false);
      setRefreshKey((k) => k + 1);

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: editingId ? 'Garment Updated' : 'Garment Added',
        message: editingId ? 'The archive piece has been successfully updated.' : 'The new piece has been saved to your digital archive.',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving item:", err);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Operation Failed',
        message: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const confirmDelete = (id: string, title: string) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Garment',
      message: `Are you sure you want to remove "${title}" from the digital archive?`,
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    setModalConfig({
      isOpen: true,
      type: 'loading',
      title: 'Removing Piece',
      message: 'Deleting garment from the archive database...',
    });

    const { error } = await supabase.from('catalog_items').delete().eq('id', id);
    if (error) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Deletion Failed',
        message: error.message,
      });
    } else {
      setRefreshKey((k) => k + 1);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Garment Removed',
        message: 'The piece has been permanently deleted from your archive.',
      });
    }
  };

  return (
    <div>
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
            The Digital Archive
          </h1>
          <p className="font-body text-sm text-mgr-text-neutral">
            Manage your boutique catalog, garments, and lookbook collections.
          </p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-mgr-primary/15 text-mgr-primary border border-mgr-primary/40 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all font-bold"
        >
          + Add New Garment
        </button>
      </header>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-20 text-center font-body text-xs text-mgr-text-neutral tracking-widest uppercase">
          Loading archive...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-mgr-surface border border-mgr-primary/10 p-16 text-center">
          <p className="font-body text-mgr-text-neutral mb-2">Your archive is currently empty.</p>
          <p className="font-body text-xs text-mgr-primary tracking-widest uppercase">Click the button above to add your first piece.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-mgr-surface border border-mgr-primary/15 overflow-hidden flex flex-col justify-between group rounded-2xl shadow-lg">
              <div>
                <div className="relative aspect-[3/4] w-full bg-mgr-background">
                  <Image
                    src={item.images[0] || "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046898/dress1_ywli2j.png"}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/85 backdrop-blur-md text-mgr-primary border border-mgr-primary/40 px-3 py-1 font-body text-[10px] font-semibold tracking-widest rounded-full uppercase shadow-md">
                      {item.sku}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="font-body text-[10px] text-mgr-text-neutral tracking-widest uppercase mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-display text-xl text-mgr-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-mgr-text-neutral line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-mgr-primary/10 mt-4 flex items-center justify-between">
                <span className="font-body text-[10px] text-mgr-primary tracking-widest">
                  {item.images?.length || 1} Image(s)
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="font-body text-[10px] text-mgr-primary hover:underline uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(item.id, item.title)}
                    className="font-body text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-mgr-surface border border-mgr-primary/20 w-full max-w-2xl p-8 md:p-10 relative max-h-[90vh] overflow-y-auto">
            
            <h2 className="font-display text-2xl text-mgr-foreground mb-6">
              {editingId ? "Edit Garment Details" : "Add New Garment to Archive"}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-mgr-background border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-foreground font-body text-sm outline-none"
                  >
                    <option value="Gowns">Gowns</option>
                    <option value="Suits">Suits</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">SKU Code (Auto)</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-mgr-background/50 border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-primary font-body text-sm outline-none tracking-widest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Imperial Velvet"
                    className="w-full bg-transparent border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-foreground font-body text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Price Tag</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. $1,200 or ₦150,000"
                    className="w-full bg-transparent border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-foreground font-body text-sm outline-none"
                  />
                </div>
              </div>

              {/* MULTIPLE IMAGE UPLOAD & PROMINENT PREVIEW GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest">Garment Lookbook Images (Multiple) *</label>
                  <div className="flex gap-4 font-body text-[10px] uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`${uploadMode === "file" ? "text-mgr-primary border-b border-mgr-primary" : "text-mgr-text-neutral"}`}
                    >
                      Upload Files
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`${uploadMode === "url" ? "text-mgr-primary border-b border-mgr-primary" : "text-mgr-text-neutral"}`}
                    >
                      Add via URL
                    </button>
                  </div>
                </div>

                {uploadMode === "file" ? (
                  <div className="border border-dashed border-mgr-primary/30 p-6 text-center bg-mgr-background/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.heic,.heif"
                      onChange={handleFilesChange}
                      className="w-full text-xs text-mgr-text-neutral file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-mgr-primary/10 file:text-mgr-primary hover:file:bg-mgr-primary/20 cursor-pointer"
                    />
                    <p className="mt-2 font-body text-[10px] text-mgr-text-neutral">Select multiple files (HEIC, PNG, JPG supported)</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="flex-1 bg-transparent border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-foreground font-body text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-4 py-2 bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/30 font-body text-xs uppercase"
                    >
                      Add URL
                    </button>
                  </div>
                )}

                {/* Prominent Image Previews Grid with Confirmation Modal Integration */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <p className="font-body text-[10px] text-mgr-primary tracking-widest uppercase mb-3">
                      Selected Images ({images.length}):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div 
                          key={img.id} 
                          className="relative aspect-[3/4] bg-mgr-background border border-mgr-primary/30 overflow-hidden group shadow-md"
                        >
                          {/* Image Asset */}
                          <Image
                            src={img.url}
                            alt={`Preview ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />

                          {/* Badge Indicator */}
                          <span className="absolute bottom-2 left-2 bg-black/80 text-mgr-primary border border-mgr-primary/30 text-[9px] px-2 py-0.5 font-body tracking-widest z-10">
                            #{index + 1}
                          </span>

                          {/* Desktop Hover Delete Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmRemoveImage(index);
                              }}
                              className="px-3 py-1.5 bg-red-950/80 border border-red-500/50 text-red-400 font-body text-[10px] uppercase tracking-widest hover:bg-red-900 transition-colors"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Fixed Mobile Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveImage(index);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-950/90 border border-red-500/50 text-red-400 rounded-full flex items-center justify-center text-xs sm:hidden z-20 shadow-lg active:scale-95 transition-transform"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A masterclass in evening wear..."
                  className="w-full bg-transparent border-b border-mgr-primary/30 focus:border-mgr-secondary py-2 text-mgr-foreground font-body text-sm outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-body text-xs text-mgr-text-neutral uppercase tracking-widest hover:text-mgr-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-mgr-primary/20 text-mgr-primary border border-mgr-primary/50 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all font-bold disabled:opacity-50"
                >
                  {uploadingImage ? "Uploading Images..." : submitting ? "Saving..." : editingId ? "Update Garment" : "Save to Archive"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Global Action Modal Feedback */}
      <ActionModal
        {...modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}