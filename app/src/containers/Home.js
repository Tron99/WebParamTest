import React, { Component } from 'react';
import Select from 'react-select'
import { connect } from 'react-redux'
import { getRandJoke, setJoke, setCategories } from '../actions/index'
import { GET_RAND_JOKE_GQL, GET_JOKE_BY_CATEGORY_GQL, CATEGORIES_GQL } from '../Queries'
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { GET_CATEGORY, GET_RAND_JOKE } from '../types';
import { store } from '../index';
import axios from 'axios'
import Loader from 'react-loader-spinner'


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const noticeStyles = {
    fontSize: "20px",
    fontStyle: "italic",
    border: "1px solid #000",
    width: "60%",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "5px"
}



class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { options: [], selectedOption: '',isLoading:false }
        this.myEventHandler = this.myEventHandler.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }
    componentWillMount() {
        axios({
            url: 'http://localhost:4000/graphiql',
            method: 'post',
            data: {
                query: CATEGORIES_GQL
            }
        }).then((result) => {
            this.props.setCategories(result.data.data.getJokeCategories)
        }).then(() => {
            this.setState({ options: this.props.categories })
        });

        this.props.setCategories();
   
    }

    myEventHandler = (e) => {
        this.setState({isLoading:true})
        axios({
            url: 'http://localhost:4000/graphiql',
            method: 'post',
            data: {
                query: GET_RAND_JOKE_GQL
            }
        }).then((result) => {
            let joke = result.data.data.getRandomJoke.value
            this.props.setJoke(joke)
            this.setState({isLoading:false})
        });

        this.props.getJoke();

    }

    categoryClicked = (e) =>{
        e.preventDefault();
        const categoryValue = e.target.value;
        axios({
            url: 'http://localhost:4000/graphiql',
            method: 'post',
            data: {
                query: GET_JOKE_BY_CATEGORY_GQL,
                variables:{
                    category:categoryValue
                }
            }
        }).then( res => {
            this.props.setJoke(res.data.data.getRandomJokeByCategory.value)
        })
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption: selectedOption.value });
    }
    render() {

        let { joke } = this.props.joke
        return (
            <div>
 
                <div id="joke-selector">
                    <div className="joke-container"><div>
{
    (this.state.isLoading) ? "Loading ...":

                        <p style={{
                            display: "block",
                            color: "#000",
                            padding: "20px",
                            border:"1px solid #000",
                            width:"40%",
                            margin:"0 auto",
                            background:"#fff",
                            borderRadius:"5px"
                        }}>{joke}</p>}
                    </div>
                    </div>

                    <h1>Click here to get joke by category</h1>
                    <ul id="categories">
                        {
                            this.state.options.map(item => {
                                return <button className="chucks-button" onClick={this.categoryClicked} value={item}  key={item}>{item}</button>
                            })
                        }
                    </ul>
                </div>

                <h1>Click here to get random joke</h1>

                <button id="getjoke-btn" onClick={this.myEventHandler}>Get Joke</button>

            </div>
        );


    }


}


const mapStateToProps = (state) => {
    return {
        joke: state.joke,
        categories: state.joke.categories
    }

}
const mapDispatchToProps = (dispatch) => {
    return {
        getJoke: () => dispatch(getRandJoke()),
        setJoke: (joke) => dispatch(setJoke(joke)),
        setCategories: (categories) => dispatch(setCategories(categories))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);