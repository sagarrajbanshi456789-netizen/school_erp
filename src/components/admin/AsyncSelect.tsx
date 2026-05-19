interface Props<T> {
  value: string
  onChange: (value: string) => void
  options: T[]
  placeholder: string
  getLabel: (item: T) => string
  getValue: (item: T) => string
}

export default function AsyncSelect<T>({
  value,
  onChange,
  options,
  placeholder,
  getLabel,
  getValue,
}: Props<T>) {
  return (
    <select
      className="p-2 border rounded w-full"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((item) => (
        <option
          key={getValue(item)}
          value={getValue(item)}
        >
          {getLabel(item)}
        </option>
      ))}
    </select>
  )
}