import React, { Component, PropTypes } from 'react';


import {browserHistory} from 'react-router';
import Link from "react-router-dom/es/Link";

export default class EpisodesList extends Component {
    constructor(props){
        super(props);
        this.state = {eps: []}
    }

    componentDidMount(){
        fetch('/api/episodes',{
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
          if (response.status >= 400) {
              throw new Error("Bad response from server");
          }
          return response.json()
        })
        .then(dataJson =>{
          this.setState({episodes:dataJson})
        })
    }


    render() {
        let episodes = this.state.eps

        return (
          <table>
              <thead>
              <tr>
                  <td>Nom</td>
                  <td>Code</td>
                  <td>Note</td>
              </tr>
              </thead>
              <tbody>
              {this.state.episodes.map(episode =>
                  <tr key={episode.id }>
                      <td>{episode.name}</td>
                      <td>{episode.code}</td>
                      <td>{episode.note}</td>
                      <td><Link className="btn btn-primary margin-10" to={`/${episode.id}`}>Détail</Link></td>
                  </tr>
              )}
              </tbody>
              <tbody>
                { episodes.map((episode) =>
                <tr onClick={() => this.showEpisode(episode)}>
                    <th>{episode.id  }</th>
                    <td>{episode.name}</td>
                    <td>{episode.code}</td>
                    <td>{episode.score} /10</td>
                    <td><Link className="btn btn-primary margin-10" to={`/${episode.id}`}>Détail</Link></td>
                </tr>
                )}
                </tbody>
          </table>
        )
    }
};
