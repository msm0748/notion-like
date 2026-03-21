import { MantineProvider as MantineProviderBase } from '@mantine/core'
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion'
import { theme } from './theme'

export default function MantineProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MantineProviderBase
      theme={theme}
      defaultColorScheme="auto"
      stylesTransform={emotionTransform}
    >
      <MantineEmotionProvider>{children}</MantineEmotionProvider>
    </MantineProviderBase>
  )
}
