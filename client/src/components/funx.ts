export function getColorObjectByKey(colorList, key) {
  return colorList.find((color) => color.key === key)
}
