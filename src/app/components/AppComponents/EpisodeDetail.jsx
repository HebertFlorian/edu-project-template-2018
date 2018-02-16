import React, { Component, PropTypes } from 'react';
import { Table, Button } from 'reactstrap';

export default class EpisodeDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            ep: []
        }
    }

    componentDidMount(){
        fetch('/api/episodes/' + this.state.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.status >= 400) {
            let errorMessage = '${response.status(${response.statusText})';
            let error = new Error(errorMessage);

            throw (error);
            }

            return response.json();
        })
        .then((data) => {
            this.setState({ ep: data });
        })

    }

    render() {
        let episode = this.state.ep

        //En cours de création
        return (
            <div>{episode.name}</div>
        )
    }
};
