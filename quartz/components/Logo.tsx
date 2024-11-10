import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const Logo: QuartzComponent = () => {
    return (
      <div className="logo">
        <img src="/assets/misc/photo.jpeg" alt="Antoine Déchappe" />
      </div>
    )
  }

  return Logo
}) satisfies QuartzComponentConstructor