import {
  NAV_ITEMS,
  INVESTMENT_GOALS,
  RISK_TOLERANCE_OPTIONS,
  PREFERRED_INDUSTRIES,
  ALERT_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  POPULAR_STOCK_SYMBOLS,
  NO_MARKET_NEWS,
  WATCHLIST_TABLE_HEADER,
} from '../constants'

describe('constants.ts', () => {
  describe('Navigation Constants', () => {
    it('should have valid NAV_ITEMS structure', () => {
      expect(NAV_ITEMS).toBeInstanceOf(Array)
      expect(NAV_ITEMS.length).toBeGreaterThan(0)
      
      NAV_ITEMS.forEach(item => {
        expect(item).toHaveProperty('href')
        expect(item).toHaveProperty('label')
        expect(typeof item.href).toBe('string')
        expect(typeof item.label).toBe('string')
        expect(item.href).toMatch(/^\//)
      })
    })

    it('should have home route in NAV_ITEMS', () => {
      const homeItem = NAV_ITEMS.find(item => item.href === '/')
      expect(homeItem).toBeDefined()
      expect(homeItem?.label).toBe('Dashboard')
    })
  })

  describe('TradingView Widget Configurations', () => {
    it('should have required TradingView properties', () => {
      expect(MARKET_OVERVIEW_WIDGET_CONFIG).toHaveProperty('colorTheme', 'dark')
      expect(MARKET_OVERVIEW_WIDGET_CONFIG).toHaveProperty('locale', 'en')
      expect(MARKET_OVERVIEW_WIDGET_CONFIG).toHaveProperty('isTransparent', true)
    })

    it('should have valid tabs structure', () => {
      expect(MARKET_OVERVIEW_WIDGET_CONFIG.tabs).toBeInstanceOf(Array)
      expect(MARKET_OVERVIEW_WIDGET_CONFIG.tabs.length).toBe(3)
    })

    it('SYMBOL_INFO_WIDGET_CONFIG should uppercase symbol', () => {
      const config = SYMBOL_INFO_WIDGET_CONFIG('aapl')
      expect(config.symbol).toBe('AAPL')
      expect(config.colorTheme).toBe('dark')
    })

    it('CANDLE_CHART_WIDGET_CONFIG should return valid config', () => {
      const config = CANDLE_CHART_WIDGET_CONFIG('googl')
      expect(config.symbol).toBe('GOOGL')
      expect(config.theme).toBe('dark')
    })
  })

  describe('Stock Symbols Constants', () => {
    it('should have valid POPULAR_STOCK_SYMBOLS array', () => {
      expect(POPULAR_STOCK_SYMBOLS).toBeInstanceOf(Array)
      expect(POPULAR_STOCK_SYMBOLS.length).toBe(50)
      
      POPULAR_STOCK_SYMBOLS.forEach(symbol => {
        expect(typeof symbol).toBe('string')
        expect(symbol).toMatch(/^[A-Z]+$/)
      })
    })

    it('should contain major tech companies', () => {
      const majorTech = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA']
      majorTech.forEach(symbol => {
        expect(POPULAR_STOCK_SYMBOLS).toContain(symbol)
      })
    })

    it('should not have duplicate symbols', () => {
      const uniqueSymbols = new Set(POPULAR_STOCK_SYMBOLS)
      expect(uniqueSymbols.size).toBe(POPULAR_STOCK_SYMBOLS.length)
    })
  })

  describe('UI Constants', () => {
    it('should have valid WATCHLIST_TABLE_HEADER', () => {
      expect(WATCHLIST_TABLE_HEADER).toBeInstanceOf(Array)
      expect(WATCHLIST_TABLE_HEADER.length).toBe(8)
      expect(WATCHLIST_TABLE_HEADER[0]).toBe('Company')
    })
  })
})