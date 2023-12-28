import React from "react";

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return<>Something is wrong</>
      ;
    }

    return this.props.children;
  }
}
