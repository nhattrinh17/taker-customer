declare namespace components {
  interface ItemDropdown {
    name: string
    id: string
  }
  interface DropdownProps {
    itemActive: ItemDropdown
    data: ItemDropdown[]
    onPress: (item: ItemDropdown) => void
  }
}
