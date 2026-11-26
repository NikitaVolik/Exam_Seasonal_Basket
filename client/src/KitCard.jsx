const imageNames = new Map([
  ["Овощной", "vegetables"],
  ["Фруктовый", "fruit"],
  ["Завтрак", "breakfast"]
])

export default function KitCard({ item, children }) {
  const imageName = imageNames.get(item.title)
  const src = imageName ? "/images/" + imageName + ".webp" : null

  return (
    <article className="card stack">
      {src && (
        <img className="card-image" src={src} alt="" loading="lazy" />
      )}
      {children}
    </article>
  )
}