import * as React from "react";
import Loading from "../../common/Loading/Loading";
function dataLoadingView(WrappedComponent: any, loadData: (any) => any) {
  return class extends React.Component<
    any,
    { loading: boolean; hasError: boolean; data: any }
  > {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        hasError: false,
        data: null
      };
    }
    onLoadStart() {
      this.setState({ loading: true });
    }
    onLoadEnd() {
      this.setState({ loading: false });
    }
    onError(e) {
      this.setState({ hasError: true });
      this.onLoadEnd();
    }
    componentWillMount() {
      this.refreshData();
    }
    refreshData() {
      this.onLoadStart();
      loadData(this.props)
        .then(e => {
          this.setState({ data: e });
          this.onLoadEnd();
        })
        .catch(e => {
          this.onError(e);
        });
    }
    render() {
      return this.state.loading ? (
        <Loading hasError={this.state.hasError} />
      ) : (
        <WrappedComponent
          data={this.state.data}
          {...this.props}
          refreshData={() => this.refreshData()}
        />
      );
    }
  };
}

export default dataLoadingView;
