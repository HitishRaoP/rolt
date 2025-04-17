import { AppRouter } from "@/modules/app/components/AppRouter"
import { ThemeProvider } from "@/components/providers/theme-provider"

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}
export default App
