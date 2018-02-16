import React, { Component, PropTypes } from 'react';

/* ------------------------------------------------ */
/* List Component */
/* ------------------------------------------------ */

export default class DeleteItemCpt extends Component {

    constructor(props) { super(props); }

    deleteAction(){
        console.log("props --->"+  this.props );
        fetch("/api/episodes/" + this.props.idEpisode, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("Error from server");
                } else {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error(error);
                window.location.reload();
            });
    }

    render(){
        return(
          <button type="button" className="btn btn-outline-danger waves-effect" onClick={() => this.deleteAction()}>
              <span>X</span>
          </button>
        );
    }
}
