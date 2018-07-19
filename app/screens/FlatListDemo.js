import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { List, ListItem, SearchBar } from "react-native-elements";

class FlatListDemo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        }
    }

    componentDidMount() {
        this.makeRequest()
    }

    makeRequest = () => {
        const { page, seed } = this.state
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;

        this.setState({loading: true})

        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    data: page === 1 ? res.results: [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                })
            })
            .catch(error => {
                this.setState({ error, loading: false})
            })
    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            seed: this.state.seed + 1,
            refreshing: true,
        }, () => this.makeRequest())
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => this.makeRequest())
    }

    handlePress = (title, message) => {
        Alert.alert(title, message)
    }

    renderSeparator = () => {
        return <View style={styles.separator}/>
    }

    renderHeader = () => {
        return <SearchBar lightTheme placeholder="Type here . . ."/>
    }

    renderFooter = () => {
        if (!this.state.loading) return null

        return (
            <View style={styles.renderFooter}>
                <ActivityIndicator size="small" animating />
            </View>
        )
    }

    render() {
        return (
            <List
                containerStyle={styles.listStyle}
            >
                <FlatList 
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <ListItem 
                            onPress={() => this.handlePress('Phone Number', item.phone)}
                            roundAvatar
                            title={`${item.name.first} ${item.name.last}`}
                            subtitle={item.email}
                            avatar={{uri: item.picture.thumbnail}}
                            containerStyle={styles.listItemStyle}
                        />
                    )}
                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    stickyHeaderIndices={[0]}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                />
            </List>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listStyle: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    listItemStyle: {
        borderBottomWidth: 0
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        width: '86%',
        backgroundColor: '#CED0CE',
        marginLeft: '14%'
    },
    renderFooter: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#CED0CE'
    }
})

export default FlatListDemo