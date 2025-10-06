import React from 'react'
import { render, screen } from '@testing-library/react'
import TradingViewWidget from '../TradingViewWidget'
import useTradingViewWidget from '@/hooks/UseTradingViewWidget'

// Mock the custom hook
jest.mock('@/hooks/UseTradingViewWidget')

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}))

const mockUseTradingViewWidget = useTradingViewWidget as jest.MockedFunction<typeof useTradingViewWidget>

describe('TradingViewWidget', () => {
  const mockRef = { current: document.createElement('div') }
  const defaultProps = {
    scriptUrl: 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
    config: { colorTheme: 'dark', locale: 'en' },
  }

  beforeEach(() => {
    mockUseTradingViewWidget.mockReturnValue(mockRef as React.RefObject<HTMLDivElement>)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy Path Scenarios', () => {
    it('should render without crashing', () => {
      render(<TradingViewWidget {...defaultProps} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        600
      )
    })

    it('should render with title when provided', () => {
      render(<TradingViewWidget {...defaultProps} title="Market Overview" />)
      expect(screen.getByText('Market Overview')).toBeInTheDocument()
      expect(screen.getByText('Market Overview')).toHaveClass('font-semibold', 'text-2xl', 'text-gray-100', 'mb-5')
    })

    it('should not render title when not provided', () => {
      render(<TradingViewWidget {...defaultProps} />)
      const heading = screen.queryByRole('heading')
      expect(heading).not.toBeInTheDocument()
    })

    it('should pass custom height to hook', () => {
      const customHeight = 800
      render(<TradingViewWidget {...defaultProps} height={customHeight} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        customHeight
      )
    })

    it('should use default height of 600 when not provided', () => {
      render(<TradingViewWidget {...defaultProps} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        600
      )
    })

    it('should apply custom className to container', () => {
      const { container } = render(
        <TradingViewWidget {...defaultProps} className="custom-chart" />
      )
      const widgetContainer = container.querySelector('.tradingview-widget-container')
      expect(widgetContainer).toHaveClass('tradingview-widget-container', 'custom-chart')
    })

    it('should render inner widget container with correct styles', () => {
      const height = 500
      const { container } = render(<TradingViewWidget {...defaultProps} height={height} />)
      const innerWidget = container.querySelector('.tradingview-widget-container__widget')
      expect(innerWidget).toBeInTheDocument()
      expect(innerWidget).toHaveStyle({ height: `${height}px`, width: '100%' })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty config object', () => {
      render(<TradingViewWidget {...defaultProps} config={{}} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        {},
        600
      )
    })

    it('should handle zero height', () => {
      render(<TradingViewWidget {...defaultProps} height={0} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        0
      )
    })

    it('should handle negative height (edge case, though not ideal)', () => {
      render(<TradingViewWidget {...defaultProps} height={-100} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        -100
      )
    })

    it('should handle very large height values', () => {
      const largeHeight = 10000
      render(<TradingViewWidget {...defaultProps} height={largeHeight} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        largeHeight
      )
    })

    it('should handle empty string title', () => {
      render(<TradingViewWidget {...defaultProps} title="" />)
      const heading = screen.queryByRole('heading')
      expect(heading).not.toBeInTheDocument()
    })

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200)
      render(<TradingViewWidget {...defaultProps} title={longTitle} />)
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle special characters in title', () => {
      const specialTitle = '<script>alert("xss")</script> & Special "Chars"'
      render(<TradingViewWidget {...defaultProps} title={specialTitle} />)
      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })

    it('should handle complex config objects with nested properties', () => {
      const complexConfig = {
        colorTheme: 'dark',
        tabs: [
          {
            title: 'Financial',
            symbols: [{ s: 'NYSE:JPM', d: 'JPMorgan Chase' }],
          },
        ],
        nested: {
          deep: {
            property: 'value',
          },
        },
      }
      render(<TradingViewWidget {...defaultProps} config={complexConfig} />)
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        complexConfig,
        600
      )
    })

    it('should handle undefined className', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} />)
      const widgetContainer = container.querySelector('.tradingview-widget-container')
      expect(widgetContainer).toHaveClass('tradingview-widget-container')
    })

    it('should handle multiple className values', () => {
      const { container } = render(
        <TradingViewWidget {...defaultProps} className="class1 class2 class3" />
      )
      const widgetContainer = container.querySelector('.tradingview-widget-container')
      expect(widgetContainer).toHaveClass('tradingview-widget-container', 'class1', 'class2', 'class3')
    })
  })

  describe('Memoization', () => {
    it('should be a memoized component', () => {
      const { rerender } = render(<TradingViewWidget {...defaultProps} />)
      const firstCallCount = mockUseTradingViewWidget.mock.calls.length

      rerender(<TradingViewWidget {...defaultProps} />)
      const secondCallCount = mockUseTradingViewWidget.mock.calls.length

      expect(secondCallCount).toBe(firstCallCount)
    })

    it('should re-render when props change', () => {
      const { rerender } = render(<TradingViewWidget {...defaultProps} />)
      const firstCallCount = mockUseTradingViewWidget.mock.calls.length

      rerender(<TradingViewWidget {...defaultProps} title="New Title" />)
      const secondCallCount = mockUseTradingViewWidget.mock.calls.length

      expect(secondCallCount).toBeGreaterThan(firstCallCount)
    })
  })
})