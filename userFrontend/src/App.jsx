import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'
import GradeSearch from './components/GradeSearch'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <GradeSearch />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
