import { ArrowUp, ArrowDown, Edit2, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import CMSButton from './CMSButton';

export default function CMSListManager({
  items = [],
  title,
  loading = false,
  onEdit,
  onDelete,
  onReorder,
  onDuplicate,
  emptyMessage = "No items found. Create your first one to get started.",
  renderExtraActions
}) {
  const handleMove = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...items];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, movedItem);
    
    // Pass updated list back so parent can save order state in DB
    onReorder?.(reordered);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6 flex flex-col gap-3 animate-pulse">
        <div className="h-6 w-1/4 bg-neutral-200 rounded" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <h3 className="font-semibold text-neutral-900 text-sm tracking-wide uppercase text-neutral-400">{title}</h3>
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center text-neutral-500 text-sm">{emptyMessage}</div>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {items.map((item, idx) => {
            const hasPublishedField = 'is_published' in item;
            
            return (
              <li key={item.id || idx} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Reordering Controls */}
                  {onReorder && (
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'up')}
                        className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMove(idx, 'down')}
                        className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  )}

                  {/* Info */}
                  <div className="min-w-0 flex flex-col gap-1">
                    <span className="font-medium text-neutral-900 truncate">
                      {item.title || item.name || "Untitled Item"}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      {hasPublishedField && (
                        <span className={`inline-flex items-center gap-1 font-medium ${item.is_published ? 'text-green-700' : 'text-neutral-500'}`}>
                          {item.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      )}
                      {item.created_at && (
                        <span>
                          &bull; Created {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {renderExtraActions && renderExtraActions(item)}
                  
                  {onDuplicate && (
                    <CMSButton
                      variant="ghost"
                      onClick={() => onDuplicate(item)}
                      title="Duplicate"
                      className="p-2"
                    >
                      <Copy size={16} />
                    </CMSButton>
                  )}

                  {onEdit && (
                    <CMSButton
                      variant="ghost"
                      onClick={() => onEdit(item)}
                      title="Edit"
                      className="p-2"
                    >
                      <Edit2 size={16} />
                    </CMSButton>
                  )}

                  {onDelete && (
                    <CMSButton
                      variant="ghost"
                      onClick={() => onDelete(item)}
                      title="Delete"
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </CMSButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
