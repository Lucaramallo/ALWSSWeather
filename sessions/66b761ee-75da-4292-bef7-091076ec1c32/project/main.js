// Weather module output shape (Nexus-7 must emit exactly this)
{
  current: {
    temperature: number,
    humidity: number,
    windSpeed: number,
    condition: {code: number, emoji: string, description: string}
  },
  location: {name: string, country: string},
  forecast: [ // 5 objects, one per day
    {date: "YYYY-MM-DD", high: number, low: number, condition: {code, emoji, description}, precipitation: number}
  ],
  error: null // or {message: string} if failed
}