import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import { Upload, Loader, Trash2, FileText } from 'lucide-react';
import { getMediaUrl } from '../components/cms/CMSMediaPicker';

export default function MediaCMS() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
      console.error(err);
      toast('Failed to load media library.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const storagePath = `general/${fileName}`;

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // 2. Add metadata record
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          storage_path: storagePath,
          file_name: file.name,
          mime_type: file.type,
          alt_text: file.name.split('.')[0]
        });

      if (dbError) throw dbError;

      toast('Media uploaded successfully!', 'success');
      fetchMedia();
    } catch (err) {
      console.error(err);
      toast(err.message || 'Failed to upload media.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.file_name}?`)) return;
    try {
      // In a real app we'd also delete the storage file via supabase.storage.from('media').remove([item.storage_path])
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      toast('Media file deleted.', 'success');
      fetchMedia();
    } catch (err) {
      console.error(err);
      toast('Failed to delete media.', 'error');
    }
  };

  const filteredMedia = mediaList.filter(item =>
    item.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">Media CMS</h1>
          <p className="text-sm text-neutral-500 font-sans">Manage uploaded assets, attachments, and images.</p>
        </div>
        <label className="relative shrink-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-medium cursor-pointer transition-colors disabled:opacity-50">
            {uploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload New File
          </span>
          <input
            type="file"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search toolbar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search media files by name..."
          className="w-full max-w-md px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 text-neutral-500 animate-pulse">
          Loading library...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500">No media found matching search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mime_type?.startsWith('image/');
            return (
              <div key={item.id} className="group relative border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 flex flex-col justify-between">
                <div className="aspect-square w-full relative bg-neutral-100 flex items-center justify-center border-b border-neutral-100 overflow-hidden">
                  {isImage ? (
                    <img
                      src={getMediaUrl(item.storage_path)}
                      alt={item.alt_text}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <FileText className="text-neutral-400" size={40} />
                  )}
                  <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full shadow-sm transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-2 text-xs truncate max-w-full font-medium text-neutral-700">
                  {item.file_name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
