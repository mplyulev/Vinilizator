const Context = React.createContext('light')
class Provider extends React.Component {
    state = {token: ''}
    render() {
        return (
            <Context.Provider value={this.state.theme}>
                {this.props.children}
            </Context.Provider>
        )
    }
}