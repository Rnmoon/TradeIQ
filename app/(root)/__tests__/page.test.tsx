import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../page'
import TradingViewWidget from '@/components/TradingViewWidget'

jest.mock('@/components/TradingViewWidget', () => {
  return jest.fn(({ title, scriptUrl, config, height, className }) => (
    <div data-testid="trading-view-widget" data-script-url={scriptUrl} data-height={height}>
      {title && <h3>{title}</h3>}
      <div data-testid="widget-config">{JSON.stringify(config)}</div>
    </div>
  ))
})

jest.mock('@/lib/constants', () => ({
  MARKET_OVERVIEW_WIDGET_CONFIG: { colorTheme: 'dark', locale: 'en' },
  HEATMAP_WIDGET_CONFIG: { dataSource: 'SPX500' },
  TOP_STORIES_WIDGET_CONFIG: { feedMode: 'market' },
  MARKET_DATA_WIDGET_CONFIG: { title: 'Stocks' },
}))

const mockedTradingViewWidget = TradingViewWidget as jest.MockedFunction<typeof TradingViewWidget>

describe('Home Page', () => {
  beforeEach(() => {
    mockedTradingViewWidget.mockClear()
  })

  it('should render without crashing', () => {
    render(<Home />)
    expect(screen.getAllByTestId('trading-view-widget')).toHaveLength(4)
  })

  it('should render all four TradingView widgets', () => {
    render(<Home />)
    expect(mockedTradingViewWidget).toHaveBeenCalledTimes(4)
  })

  it('should render Market Overview widget with correct props', () => {
    render(<Home />)
    
    const calls = mockedTradingViewWidget.mock.calls
    const marketOverviewCall = calls.find(call => call[0].title === 'Market Overview')
    
    expect(marketOverviewCall).toBeDefined()
    expect(marketOverviewCall[0]).toMatchObject({
      title: 'Market Overview',
      scriptUrl: expect.stringContaining('market-overview.js'),
      height: 600,
      className: 'custom-chart',
    })
  })

  it('should render Stock Heatmap widget', () => {
    render(<Home />)
    
    const calls = mockedTradingViewWidget.mock.calls
    const heatmapCall = calls.find(call => call[0].title === 'Stock Heatmap')
    
    expect(heatmapCall).toBeDefined()
    expect(heatmapCall[0].scriptUrl).toContain('stock-heatmap.js')
  })

  it('should set all widgets to 600px height', () => {
    render(<Home />)
    
    mockedTradingViewWidget.mock.calls.forEach(call => {
      expect(call[0].height).toBe(600)
    })
  })
})