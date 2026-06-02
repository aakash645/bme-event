export default function GuestFields({ register, errors, prefix }) {
  const e = errors?.[prefix] || {};

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label>Full name *</label>
          <input
            {...register(`${prefix}.name`, { required: 'Name is required' })}
            placeholder="Jane Doe"
            className={e.name ? 'error' : ''}
          />
          {e.name && <p className="field-error">{e.name.message}</p>}
        </div>
        <div className="form-group">
          <label>Phone number *</label>
          <input
            {...register(`${prefix}.phone`, {
              required: 'Phone is required',
              pattern: { value: /^[+\d\s\-()]{7,15}$/, message: 'Invalid phone number' },
            })}
            placeholder="+91 98765 43210"
            className={e.phone ? 'error' : ''}
          />
          {e.phone && <p className="field-error">{e.phone.message}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Email address *</label>
          <input
            type="email"
            {...register(`${prefix}.email`, {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
            })}
            placeholder="jane@company.com"
            className={e.email ? 'error' : ''}
          />
          {e.email && <p className="field-error">{e.email.message}</p>}
        </div>
        <div className="form-group">
          <label>Company name *</label>
          <input
            {...register(`${prefix}.company`, { required: 'Company is required' })}
            placeholder="Acme Corp"
            className={e.company ? 'error' : ''}
          />
          {e.company && <p className="field-error">{e.company.message}</p>}
        </div>
      </div>
    </div>
  );
}
