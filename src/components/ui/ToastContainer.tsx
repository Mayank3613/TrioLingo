import { motion, AnimatePresence } from 'motion/react';
import { useToastStore, type ToastType } from '../../stores/toastStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICON_MAP: Record<ToastType, { icon: typeof CheckCircle; color: string }> = {
  success: { icon: CheckCircle, color: '#22c55e' },
  error: { icon: XCircle, color: '#ef4444' },
  warning: { icon: AlertTriangle, color: '#f59e0b' },
  info: { icon: Info, color: 'var(--accent-primary)' },
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      className="fixed flex flex-col-reverse gap-2"
      style={{ bottom: 24, right: 24, zIndex: 9999 }}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Icon, color } = ICON_MAP[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative flex items-start gap-3 rounded-xl overflow-hidden"
              style={{
                width: 360,
                minWidth: 280,
                padding: '12px 16px',
                paddingLeft: 20,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Left color stripe */}
              <div
                className="absolute rounded-full"
                style={{
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  background: color,
                }}
              />

              <Icon size={20} style={{ color, flexShrink: 0, marginTop: 1 }} />

              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t.title}
                </div>
                {t.description && (
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t.description}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 cursor-pointer transition-colors"
                style={{ color: 'var(--text-tertiary)', marginTop: 1 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    'var(--text-tertiary)';
                }}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
