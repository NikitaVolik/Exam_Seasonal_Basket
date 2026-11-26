export const statuses = [
  {value: 'new', label: 'Новый'},
  {value: 'active', label: 'Собран'},
  {value: 'completed', label: 'Получен'}
]

export function statusLabel(value) {
  return statuses.find(status => status.value === value)?.label || value
}