import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useToast } from './ToastContext';
import { Upload, Image as ImageIcon, X, Loader } from 'lucide-react';
import CMSButton from './CMSButton';

// Utility helper to get the public URL for any storage path
export function getMediaUrl(storagePath) {
  if (!storagePath) return '';
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath;
  return supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl;
}

export default function CMSMediaPicker({
  value, // Expecting a media object: { id, storage_path, file_name, alt_text }
  onChange,
  label = "Select Media",
  folder = "general",
  aspectRatio = "aspect-video"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMediaList(data || []);
    } catch (err) {
      toast('Failed to load media library', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const storagePath = `${folder}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert metadata to `media` database table
      const { data: dbData, error: dbError } = await supabase
        .from('media')
        .insert({
          storage_path: storagePath,
          file_name: file.name,
          mime_type: file.type,
          alt_text: file.name.split('.')[0]
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast('Media uploaded successfully', 'success');
      onChange(dbData);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast(err.message || 'Failed to upload media', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (item) => {
    onChange(item);
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const filteredMediaList = mediaList.filter(item => 
    item.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}

      {value ? (
        // Preview State
        <div className={`relative border border-neutral-200 rounded-lg overflow-hidden group ${aspectRatio} bg-neutral-100 max-w-md w-full`}>
          <img 
            src={getMediaUrl(value.storage_path)} 
            alt={value.alt_text || "Selected preview"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <CMSButton variant="secondary" onClick={() => setIsOpen(true)}>Change</CMSButton>
            <CMSButton variant="danger" onClick={handleRemove}><X size={16} /></CMSButton>
          </div>
          <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded truncate max-w-[80%]">
            {value.file_name}
          </div>
        </div>
      ) : (
        // Empty State
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-neutral-400 hover:bg-neutral-50 transition-colors p-6 max-w-md w-full ${aspectRatio}`}
        >
          <ImageIcon className="text-neutral-400" size={32} />
          <span className="text-sm font-medium text-neutral-600">Select Image</span>
        </button>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-neutral-950/20 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all w-full max-w-3xl border border-neutral-200 flex flex-col max-h-[85vh]">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900">Media Library</h3>
                <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-neutral-700">
                  <X size={20} />
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search files..."
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label className="relative shrink-0">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-medium cursor-pointer transition-colors disabled:opacity-50">
                    {uploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
                    Upload File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto min-h-[300px] border-t border-neutral-100 pt-4">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-neutral-500">
                    Loading files...
                  </div>
                ) : filteredMediaList.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    No files found in library.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredMediaList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="group relative border border-neutral-200 rounded-lg overflow-hidden aspect-square bg-neutral-50 hover:border-neutral-900 transition-colors"
                      >
                        <img 
                          src={getMediaUrl(item.storage_path)} 
                          alt={item.alt_text} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-neutral-100 p-1 text-[10px] text-neutral-600 truncate">
                          {item.file_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
