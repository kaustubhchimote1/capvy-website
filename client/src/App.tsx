import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CAPVYShell from "@/components/CAPVYShell";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Assistant = lazy(() => import("@/pages/Assistant"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const Cashflow = lazy(() => import("@/pages/Cashflow"));
const Home = lazy(() => import("@/pages/Home"));
const Learn = lazy(() => import("@/pages/Learn"));
const Markets = lazy(() => import("@/pages/Markets"));
const News = lazy(() => import("@/pages/News"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Premium = lazy(() => import("@/pages/Premium"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" />
          <CAPVYShell>
            <Suspense fallback={<div className="route-loading" role="status">Opening your learning space…</div>}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/signup" component={AuthPage} />
                <Route path="/login" component={AuthPage} />
                <Route path="/cashflow" component={Cashflow} />
                <Route path="/learn" component={Learn} />
                <Route path="/markets" component={Markets} />
                <Route path="/news" component={News} />
                <Route path="/assistant" component={Assistant} />
                <Route path="/premium" component={Premium} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </CAPVYShell>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
