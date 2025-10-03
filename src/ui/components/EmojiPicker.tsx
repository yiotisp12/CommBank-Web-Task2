import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void }

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={props.onClick}
      color="primary"
    />
  )
}

// Inside your component file (e.g., GoalManager.tsx or wherever you pick emojis)
import type { Goal } from '@/types/Goal'
import type { EmojiData } from 'emoji-mart'
import { updateGoal } from '@/lib/goals'

async function pickEmojiOnClick(
  emoji: EmojiData,
  goal: Goal,
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
) {
  // emoji-mart v3 gives .native on the selected emoji object
  const nextIcon = (emoji as any)?.native ?? ''

  // optimistic UI
  setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, icon: nextIcon } : g)))

  try {
    await updateGoal({ ...goal, icon: nextIcon })
    // no-op: server returns 204 No Content; state already updated
  } catch (err) {
    // rollback if request fails
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, icon: goal.icon ?? null } : g)))
    console.error('Failed to save icon', err)
  }
}
