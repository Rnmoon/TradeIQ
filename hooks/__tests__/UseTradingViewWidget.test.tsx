import { renderHook, waitFor } from '@testing-library/react'
import useTradingViewWidget from '../UseTradingViewWidget'

describe('useTradingViewWidget', () => {
  let mockContainer: HTMLDivElement
  let scriptElements: HTMLScriptElement[]

  beforeEach(() => {
    mockContainer = document.createElement('div')
    scriptElements = []

    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'script') {
        scriptElements.push(element as HTMLScriptElement)
      }
      return element
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    scriptElements = []
  })

  describe('Happy Path Scenarios', () => {
    it('should return a ref object', () => {
      const { result } = renderHook(() =>
        useTradingViewWidget(
          'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
          { colorTheme: 'dark' },
          600
        )
      )

      expect(result.current).toBeDefined()
      expect(result.current).toHaveProperty('current')
    })

    it('should create and append script element when ref is attached', async () => {
      const scriptUrl = 'https://s3.tradingview.com/test-widget.js'
      const config = { colorTheme: 'dark', locale: 'en' }
      const height = 600

      const { result } = renderHook(() => useTradingViewWidget(scriptUrl, config, height))

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(scriptElements.length).toBeGreaterThan(0)
      })

      const script = scriptElements[0]
      expect(script.src).toBe(scriptUrl)
      expect(script.async).toBe(true)
      expect(script.innerHTML).toBe(JSON.stringify(config))
    })

    it('should set container innerHTML with correct height', async () => {
      const height = 800
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, height)
      )

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(mockContainer.innerHTML).toContain(`height: ${height}px`)
      })
    })

    it('should mark container as loaded with data attribute', async () => {
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 600)
      )

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(mockContainer.dataset.loaded).toBe('true')
      })
    })

    it('should not reload if already loaded', async () => {
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 600)
      )

      if (result.current) {
        result.current.current = mockContainer
        mockContainer.dataset.loaded = 'true'
      }

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(scriptElements.length).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty config object', async () => {
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 600)
      )

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(scriptElements.length).toBeGreaterThan(0)
      })

      expect(scriptElements[0].innerHTML).toBe('{}')
    })

    it('should handle zero height', async () => {
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 0)
      )

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(mockContainer.innerHTML).toContain('height: 0px')
      })
    })

    it('should not execute if container ref is null', () => {
      const { result } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 600)
      )

      expect(result.current.current).toBeNull()
      expect(scriptElements.length).toBe(0)
    })
  })

  describe('Cleanup Behavior', () => {
    it('should clean up on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useTradingViewWidget('https://test.com/widget.js', {}, 600)
      )

      if (result.current) {
        result.current.current = mockContainer
      }

      await waitFor(() => {
        expect(mockContainer.dataset.loaded).toBe('true')
      })

      unmount()

      expect(mockContainer.innerHTML).toBe('')
      expect(mockContainer.dataset.loaded).toBeUndefined()
    })
  })
})