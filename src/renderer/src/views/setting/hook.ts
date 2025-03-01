import { ref } from 'vue'

export const useSetting = () => {
  const handleCardClick = (cardName: string, index: number) => {
    console.log(cardName, index)
  }
  return {
    handleCardClick
  }
}
