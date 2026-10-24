import React from 'react'

function _showToast(message, type = 'info') {
  if (typeof document === 'undefined') return
  const colors = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#374151' }
  const el = document.createElement('div')
  el.textContent = message
  el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;color:#fff;font-size:14px;font-weight:500;background:${colors[type]||colors.info};box-shadow:0 4px 16px rgba(0,0,0,.18);transition:opacity .3s;`
  document.body.appendChild(el)
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }, 3000)
}
export const toast = Object.assign(
  (message, type) => _showToast(message, type),
  { success: (m) => _showToast(m, 'success'), error: (m) => _showToast(m, 'error'), warning: (m) => _showToast(m, 'warning'), info: (m) => _showToast(m, 'info') }
)

export function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, loading = false, size, className = '', ...props }) {
  const cls = variant === 'secondary' ? 'btn-secondary' : variant === 'ghost' ? 'btn-ghost' : variant === 'danger' ? 'btn-danger' : 'btn-primary'
  const isDisabled = disabled || loading
  return <button type={type} onClick={onClick} disabled={isDisabled} className={`${cls} ${className}`} style={{ opacity: isDisabled ? 0.6 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }} {...props}>{loading ? '…' : children}</button>
}

export function Card({ children, className = '', style = {}, padding, variant, interactive, ...props }) {
  const padMap = { sm: '12px', md: '20px', lg: '32px' }
  const p = padMap[padding] || '24px'
  const extra = variant === 'bordered' ? { borderColor: 'var(--border,rgba(0,0,0,.15))' } : {}
  const hover = interactive ? { cursor: 'pointer' } : {}
  return <div className={`card ${className}`} style={{ background: 'var(--surface,#fff)', border: '1px solid var(--border,rgba(0,0,0,.08))', borderRadius: '12px', padding: p, ...extra, ...hover, ...style }} {...props}>{children}</div>
}

export function Spinner({ className = '', size, ...props }) {
  const dim = size === 'sm' ? '1.5rem' : size === 'lg' ? '3.5rem' : '2.5rem'
  return (
    <div className={`spinner-container ${className}`} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'1rem', width:'100%' }} {...props}>
      <div style={{ width:dim, height:dim, border:'3px solid rgba(var(--primary-rgb,99,102,241),.15)', borderTopColor:'var(--primary,#6366f1)', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style dangerouslySetInnerHTML={{__html:'@keyframes spin{to{transform:rotate(360deg)}}'}} />
    </div>
  )
}

export function Badge({ children, variant = 'primary', dot, className = '', ...props }) {
  const styles = {
    primary: { background:'rgba(99,102,241,.15)', color:'#6366f1', border:'1px solid rgba(99,102,241,.3)' },
    success: { background:'rgba(34,197,94,.15)', color:'#22c55e', border:'1px solid rgba(34,197,94,.3)' },
    warning: { background:'rgba(234,179,8,.15)', color:'#eab308', border:'1px solid rgba(234,179,8,.3)' },
    secondary: { background:'rgba(100,116,139,.15)', color:'#94a3b8', border:'1px solid rgba(100,116,139,.3)' },
    danger: { background:'rgba(239,68,68,.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,.3)' },
    error: { background:'rgba(239,68,68,.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,.3)' },
    info: { background:'rgba(59,130,246,.15)', color:'#3b82f6', border:'1px solid rgba(59,130,246,.3)' },
  }
  return <span className={`badge ${className}`} style={{ display:'inline-block', padding:'.25rem .6rem', fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', borderRadius:'9999px', ...(styles[variant]||styles.primary) }} {...props}>{children}</span>
}

export function Alert({ children, variant = 'error', title, className = '', ...props }) {
  const cls = variant === 'success' ? 'alert alert-success' : variant === 'info' ? 'alert alert-info' : variant === 'warning' ? 'alert alert-warning' : 'alert alert-error'
  return <div className={`${cls} ${className}`} style={{ margin:'1rem 0', padding:'1rem', borderRadius:'6px', borderLeft:'4px solid currentColor' }} {...props}>
    {title && <strong style={{ display:'block', marginBottom:'4px' }}>{title}</strong>}
    {children}
  </div>
}

export function Input({ className = '', style = {}, label, ...props }) {
  const el = <input className={className} style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--border,rgba(0,0,0,.12))', borderRadius:'8px', fontSize:'.9375rem', background:'var(--surface,#fff)', color:'var(--text,#111)', outline:'none', ...style }} {...props} />
  if (!label) return el
  return <label style={{ display:'block' }}><span style={{ display:'block', marginBottom:'4px', fontSize:'.875rem', fontWeight:500, color:'var(--text,#111)' }}>{label}</span>{el}</label>
}

export function Select({ children, options, className = '', style = {}, label, ...props }) {
  const sel = (
    <select className={className} style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--border,rgba(0,0,0,.12))', borderRadius:'8px', fontSize:'.9375rem', background:'var(--surface,#fff)', color:'var(--text,#111)', outline:'none', cursor:'pointer', ...style }} {...props}>
      {options ? options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>) : children}
    </select>
  )
  if (!label) return sel
  return <label style={{ display:'block' }}><span style={{ display:'block', marginBottom:'4px', fontSize:'.875rem', fontWeight:500, color:'var(--text,#111)' }}>{label}</span>{sel}</label>
}

export function Textarea({ className = '', style = {}, label, ...props }) {
  const el = <textarea className={className} style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--border,rgba(0,0,0,.12))', borderRadius:'8px', fontSize:'.9375rem', background:'var(--surface,#fff)', color:'var(--text,#111)', outline:'none', resize:'vertical', minHeight:'100px', ...style }} {...props} />
  if (!label) return el
  return <label style={{ display:'block' }}><span style={{ display:'block', marginBottom:'4px', fontSize:'.875rem', fontWeight:500, color:'var(--text,#111)' }}>{label}</span>{el}</label>
}

export function Modal({ isOpen, open, onClose, title, children, size }) {
  if (!(isOpen ?? open)) return null
  const maxW = size === 'lg' ? '720px' : size === 'xl' ? '900px' : size === 'sm' ? '400px' : '550px'
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.5)', padding:'1rem' }} onClick={onClose}>
      <div style={{ background:'var(--surface,#fff)', borderRadius:'12px', width:'100%', maxWidth:maxW, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 25px -5px rgba(0,0,0,.1)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border,rgba(0,0,0,.08))' }}>
          <h3 style={{ margin:0, fontSize:'1.25rem', fontWeight:600 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', lineHeight:1 }}>&times;</button>
        </div>
        <div style={{ padding:'1.5rem' }}>{children}</div>
      </div>
    </div>
  )
}
Modal.Footer = function ModalFooter({ children }) {
  return <div style={{ display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'24px', paddingTop:'16px', borderTop:'1px solid var(--border,rgba(0,0,0,.08))' }}>{children}</div>
}

export function Stat({ value, label, icon, change, className = '' }) {
  return (
    <div className={`stat ${className}`} style={{ textAlign:'center', padding:'1.5rem', background:'var(--surface,#fff)', borderRadius:'12px', border:'1px solid var(--border,rgba(0,0,0,.08))' }}>
      {icon && <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{icon}</div>}
      <div style={{ fontSize:'2.25rem', fontWeight:700, color:'var(--primary,#6366f1)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'.875rem', color:'var(--muted,#64748b)', marginTop:'.35rem' }}>{label}</div>
      {change && <div style={{ fontSize:'.8125rem', marginTop:'6px', color: String(change).startsWith('+') ? '#16a34a' : '#dc2626' }}>{change}</div>}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, action, icon = '📭' }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--muted,#64748b)' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{icon}</div>
      <h3 style={{ margin:'0 0 .5rem', color:'var(--text,#111)', fontWeight:600 }}>{title}</h3>
      {description && <p style={{ margin:'0 0 1.5rem', maxWidth:'400px', marginInline:'auto' }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, description, actions, children, className = '' }) {
  const sub = subtitle || description
  const act = actions || children
  return (
    <div className={`page-header ${className}`} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
      <div>
        <h1 style={{ margin:0, fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700 }}>{title}</h1>
        {sub && <p style={{ margin:'.35rem 0 0', color:'var(--muted,#64748b)' }}>{sub}</p>}
      </div>
      {act && <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', alignItems:'center' }}>{act}</div>}
    </div>
  )
}

export function Table({ columns, rows, headers, children, className = '' }) {
  if (columns && rows) {
    return (
      <div style={{ overflowX:'auto' }}>
        <table className={`table ${className}`} style={{ width:'100%', borderCollapse:'collapse', fontSize:'.9375rem' }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ padding:'.75rem 1rem', textAlign:'left', borderBottom:'2px solid var(--border,rgba(0,0,0,.1))', fontWeight:600, color:'var(--muted,#64748b)', whiteSpace:'nowrap' }}>
                  {typeof col === 'string' ? col : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom:'1px solid var(--border,rgba(0,0,0,.06))' }}>
                {columns.map((col, ci) => (
                  <td key={ci} style={{ padding:'.75rem 1rem' }}>{typeof col === 'string' ? row[col] : (col.accessor ? row[col.accessor] : row[ci])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div style={{ overflowX:'auto' }}>
      <table className={`table ${className}`} style={{ width:'100%', borderCollapse:'collapse', fontSize:'.9375rem' }}>
        {headers && headers.length > 0 && (
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border,rgba(0,0,0,.08))' }}>
              {headers.map((h, i) => <th key={i} style={{ padding:'12px 16px', fontSize:'.875rem', fontWeight:600, color:'var(--muted,#64748b)' }}>{h}</th>)}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
Table.Head = function TableHead({ children }) { return <thead>{children}</thead> }
Table.Body = function TableBody({ children }) { return <tbody>{children}</tbody> }
Table.Row = function TableRow({ children, clickable, onClick, style, ...props }) {
  return <tr onClick={onClick} style={{ borderBottom:'1px solid var(--border,rgba(0,0,0,.06))', cursor: clickable ? 'pointer' : 'default', ...style }} {...props}>{children}</tr>
}
Table.Th = function TableTh({ children, style, ...props }) {
  return <th style={{ padding:'12px 16px', fontSize:'.875rem', fontWeight:600, color:'var(--muted,#64748b)', textAlign:'left', ...style }} {...props}>{children}</th>
}
Table.Td = function TableTd({ children, style, ...props }) {
  return <td style={{ padding:'12px 16px', fontSize:'.9rem', color:'var(--text,#111)', verticalAlign:'middle', ...style }} {...props}>{children}</td>
}

export function Tabs({ tabs = [], active, value, onChange, children, className = '' }) {
  const current = active ?? value
  const hasTabs = tabs.length > 0
  const tabStyle = (isActive) => ({ padding:'.6rem 1.25rem', background:'none', border:'none', borderBottom:isActive ? '2px solid var(--primary,#6366f1)' : '2px solid transparent', marginBottom:'-2px', fontWeight:isActive ? 600 : 400, color:isActive ? 'var(--primary,#6366f1)' : 'var(--muted,#64748b)', cursor:'pointer', borderRadius:'4px 4px 0 0', transition:'all .15s' })
  return (
    <div className={`tabs ${className}`} style={{ display:'flex', gap:'.25rem', borderBottom:'2px solid var(--border,rgba(0,0,0,.1))', marginBottom:'1.5rem' }}>
      {hasTabs ? tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id
        const label = typeof tab === 'string' ? tab : tab.label
        return <button key={id} onClick={() => onChange?.(id)} style={tabStyle(current === id)}>{label}</button>
      }) : React.Children.map(children, (child) =>
        child && typeof child === 'object' && 'props' in child
          ? React.cloneElement(child, { _active: current, _onChange: onChange })
          : child
      )}
    </div>
  )
}
Tabs.Tab = function TabsTab({ value: tabValue, children, _active, _onChange, ...props }) {
  const isActive = _active === tabValue
  return (
    <button onClick={() => _onChange?.(tabValue)}
      style={{ padding:'.6rem 1.25rem', background:'none', border:'none', borderBottom:isActive ? '2px solid var(--primary,#6366f1)' : '2px solid transparent', marginBottom:'-2px', fontWeight:isActive ? 600 : 400, color:isActive ? 'var(--primary,#6366f1)' : 'var(--muted,#64748b)', cursor:'pointer', borderRadius:'4px 4px 0 0', transition:'all .15s' }}
      {...props}>
      {children}
    </button>
  )
}

const UI = { toast, Button, Card, Spinner, Badge, Alert, Input, Select, Textarea, Modal, Stat, EmptyState, PageHeader, Table, Tabs }
export default UI
