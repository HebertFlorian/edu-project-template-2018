import React, { Component, PropTypes } from 'react';
import { Link } from "react-router-dom";

/* ------------------------------------------------ */
/* Edit Component */
/* ------------------------------------------------ */

export default class EpisodeEditComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            name: '',
            code: '',
            note: '',
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCode = this.handleChangeCode.bind(this);
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            this.setState({ name: data.name });
            this.setState({ code: data.code });
            this.setState({ note: data.note });
        })
    }

    handleChangeName(event) {
        let state = this.state;
        state.name = event.target.value;
        this.setState(state);
    }

    handleChangeCode(event) {
        let state = this.state;
        state.code = event.target.value;
        this.setState(state);
    }

    handleChangeNote(event) {
        let state = this.state;
        state.note = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
          var episode = {
              name:  this.state.name,
              code:  this.state.code,
              note:  this.state.note
          };

          fetch('/api/episodes/' + this.state.id, {
              method: 'PUT',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(episode)
          })
          .then(response => {
              if (response.status >= 400) {
                  let errorMessage = '${response.status(${response.statusText})';
                  let error = new Error(errorMessage);

                  console.log(error);
                  this.toggle;
              }
              else {
                  window.location.reload();
              }
          })
    }

    render(){
        return(
          <form className="elegant-color formDesign" onSubmit={this.handleSubmit}>

              <label>NAME</label>
              <input id="name" className="form-control" type="text" value={this.state.name} onChange={this.handleChangeName} />

              <label>CODE</label>
              <input id="code" className="form-control" type="text" value={this.state.code} onChange={this.handleChangeCode} />

              <label>NOTE</label>
              <input id="note" className="form-control" type="text" value={this.state.note} onChange={this.handleChangeNote}/>

              <Link className="btn btn-outline-warning waves-effect" type="submit" to={`/menu`}>EDIT</Link>
          </form>
        )
    }
}
