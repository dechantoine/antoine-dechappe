import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function Spacer({ displayClass }: QuartzComponentProps) {
  return <div class={classNames(displayClass, "spacer")} style={{ margin: "25px 0" }}></div>
}

export default (() => Spacer) satisfies QuartzComponentConstructor
