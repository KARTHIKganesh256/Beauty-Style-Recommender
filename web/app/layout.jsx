import './globals.css'

export const metadata = {
  title: 'Beauty & Style Recommender',
  description: 'Personalized products by skin tone and undertone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}


