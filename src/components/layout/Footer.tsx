export function Footer() {
  return (
    <footer
      className="flex items-center justify-between flex-shrink-0"
      style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--border-secondary)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--text-tertiary)',
      }}
    >
      <span>
        TrioLingo<span style={{ color: 'var(--accent-primary)' }}>++</span>{' '}
        v0.1.0
      </span>
      <span>Made with ❤️ for Japanese learners</span>
      <span>© 2025 TrioLingo++</span>
    </footer>
  );
}
