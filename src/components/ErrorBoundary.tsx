import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white px-6 select-none">
          <div className="max-w-md text-center">
            <span className="font-mono text-[10px] tracking-[0.5em] text-zinc-500 uppercase block mb-6">
              Erro Crítico
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-wider text-white mb-4">
              Algo quebrou.
            </h1>
            <p className="text-zinc-400 text-sm font-light tracking-wide mb-8 font-mono">
              {this.state.error?.message || "            Um erro inesperado ocorreu."}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-full bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-500 cursor-pointer text-zinc-400 hover:text-white font-mono text-[10px] tracking-[0.3em] uppercase"
            >
              Recarregar Experiência
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
