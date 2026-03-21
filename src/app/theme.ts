import {
  ActionIcon,
  Button,
  colorsTuple,
  createTheme,
  Menu,
  NavLink,
  virtualColor,
} from '@mantine/core';

/**
 * Notion 디자인 시스템 기반 Mantine 테마
 *
 * 색상 배열은 인덱스 0(가장 밝음) → 9(가장 어두움) 순서로 정의합니다.
 *
 * Light Mode:
 *   - 에디터 배경: #FFFFFF
 *   - 사이드바 배경: #F7F7F5
 *   - 호버 배경: #EFEFED
 *   - 기본 텍스트: #37352F
 *   - 보조 텍스트: #787774
 *   - 플레이스홀더: #9B9A97
 *   - 테두리: #E9E9E7
 *
 * Dark Mode:
 *   - 에디터 배경: #191919
 *   - 사이드바 배경: #202020
 *   - 호버 배경: #2C2C2C
 *   - 기본 텍스트: #ECECEC
 *   - 보조 텍스트: #9B9A97
 *   - 테두리: #2F2F2F
 */
export const theme = createTheme({
  fontFamily:
    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  defaultRadius: 'sm',
  cursorType: 'pointer',

  primaryColor: 'notionBlue',
  primaryShade: { light: 6, dark: 5 },

  white: '#FFFFFF',
  black: '#37352F',

  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },

  headings: {
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif',
    sizes: {
      h1: { fontSize: '40px', fontWeight: '700' },
      h2: { fontSize: '30px', fontWeight: '600' },
      h3: { fontSize: '26px', fontWeight: '600' },
      h4: { fontSize: '22px', fontWeight: '600' },
      h5: { fontSize: '20px', fontWeight: '600' },
      h6: { fontSize: '18px', fontWeight: '600' },
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },

  radius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },

  colors: {
    /**
     * Notion 그레이 팔레트
     * [0] 가장 밝음(흰색/에디터 배경 라이트) → [9] 가장 어두움(에디터 배경 다크)
     */
    notionGray: [
      '#FFFFFF', // 0 - 에디터 배경 (라이트)
      '#F7F7F5', // 1 - 사이드바 배경 (라이트)
      '#EFEFED', // 2 - 호버 배경 (라이트)
      '#E9E9E7', // 3 - 테두리 (라이트)
      '#D3D1CB', // 4 - 중간 회색
      '#9B9A97', // 5 - 플레이스홀더 / 다크 보조 텍스트
      '#787774', // 6 - 보조 텍스트 (라이트)
      '#37352F', // 7 - 기본 텍스트 (라이트)
      '#2C2C2C', // 8 - 호버 배경 (다크)
      '#191919', // 9 - 에디터 배경 (다크)
    ],

    /**
     * Notion 블루 팔레트
     * 링크 색상(#0A85D1), 선택 색상(#2383E2) 포함
     */
    notionBlue: [
      '#E7F3F8', // 0 - 블록 배경 블루 (라이트)
      '#D0E8F2', // 1
      '#B8DCED', // 2
      '#93CBE5', // 3
      '#6BB8DB', // 4
      '#0A85D1', // 5 - 링크 색상
      '#2383E2', // 6 - 선택/드래그 색상
      '#1A6DB8', // 7
      '#135492', // 8
      '#0D3E6E', // 9
    ],

    /**
     * 블록 배경 색상 팔레트 (라이트 → 다크 순서로 구성)
     * 에디터 내 블록 배경에 사용
     */
    notionBlockGray: colorsTuple('#F1F1EF'),
    notionBlockBrown: colorsTuple('#F4EEEE'),
    notionBlockOrange: colorsTuple('#FBECDD'),
    notionBlockYellow: colorsTuple('#FBF3DB'),
    notionBlockGreen: colorsTuple('#EDF3EC'),
    notionBlockBlue: colorsTuple('#E7F3F8'),
    notionBlockPurple: colorsTuple('#F6F3F9'),
    notionBlockPink: colorsTuple('#FAF1F5'),
    notionBlockRed: colorsTuple('#FDEBEC'),

    /**
     * virtualColor: 라이트/다크 모드에 따라 자동으로 전환되는 색상
     * primaryColor로 사용하기 위한 Notion 기본 색상
     */
    primary: virtualColor({
      name: 'primary',
      light: 'notionBlue',
      dark: 'notionBlue',
    }),
  },

  other: {
    /**
     * CSS 변수로 사용할 Notion 디자인 토큰
     * 컴포넌트에서 theme.other.colors.light.editorBg 형태로 접근 가능
     */
    colors: {
      light: {
        editorBg: '#FFFFFF',
        sidebarBg: '#F7F7F5',
        hoverBg: '#EFEFED',
        textPrimary: '#37352F',
        textSecondary: '#787774',
        textPlaceholder: '#9B9A97',
        border: '#E9E9E7',
      },
      dark: {
        editorBg: '#191919',
        sidebarBg: '#202020',
        hoverBg: '#2C2C2C',
        textPrimary: '#ECECEC',
        textSecondary: '#9B9A97',
        textPlaceholder: '#9B9A97',
        border: '#2F2F2F',
      },
      block: {
        light: {
          gray: '#F1F1EF',
          brown: '#F4EEEE',
          orange: '#FBECDD',
          yellow: '#FBF3DB',
          green: '#EDF3EC',
          blue: '#E7F3F8',
          purple: '#F6F3F9',
          pink: '#FAF1F5',
          red: '#FDEBEC',
        },
        dark: {
          gray: '#252525',
          brown: '#2F2723',
          orange: '#382800',
          yellow: '#392E05',
          green: '#0F291E',
          blue: '#0B2838',
          purple: '#28203B',
          pink: '#321C28',
          red: '#3E1515',
        },
      },
      link: '#0A85D1',
      selection: '#2383E2',
    },
  },

  components: {
    Button: Button.extend({
      defaultProps: {
        variant: 'subtle',
        radius: 'md',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    NavLink: NavLink.extend({
      styles: {
        root: {
          '&[data-status=active]': {
            backgroundColor: 'var(--mantine-color-notionGray-3)',
          },
          '&:hover': {
            backgroundColor: 'var(--mantine-color-notionGray-2)',
          },
        },
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        radius: 'md',
        shadow: 'md',
      },
      styles: {
        dropdown: {
          border: '1px solid var(--mantine-color-default-border)',
        },
      },
    }),
  },
});
