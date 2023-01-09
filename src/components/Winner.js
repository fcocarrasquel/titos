import React, { Component } from 'react';
import smart_contract from '../abis/loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class Winner extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡You should consider using Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId()
    console.log('networkid:', networkId)
    const networkData = smart_contract.networks[networkId]
    console.log('NetworkData:', networkData)

    if (networkData) {
      const abi = smart_contract.abi
      console.log('abi', abi)
      const address = networkData.address
      console.log('address:', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
    } else {
      window.alert('¡The Lottery has not been deployed on the network!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      contract: null,
      errorMessage: ""
    }
  }

  _generarGanador = async () => {
    try {
      console.log("Generated Winner...")
      await this.state.contract.methods.generarGanador().send({
        from: this.state.account
      })
      Swal.fire({
        icon: 'success',
        title: '¡Successfully Generated Winner!',
        width: 800,
        padding: '3em',
        backdrop: `
          rgba(15, 238, 168, 0.2)
          left top
          no-repeat
        `
      })
    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
    }
  }

  _ganador = async () => {
    try {
      console.log("Winner...")
      const winner = await this.state.contract.methods.ganador().call()
      Swal.fire({
        icon: 'info',
        title: '💰 The winner of the Lottery is:',
        text: `${winner}`,
        width: 800,
        padding: '3em',
        backdrop: `
          rgba(15, 238, 168, 0.2)
          left top
          no-repeat
        `
      })
    } catch (err) {
      this.setState({ errorMessage: err })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <div>
        <Navigation  bg="dark" variant="dark" account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center text-white">
              <div className="content mr-auto ml-auto">
                <h1> Choice of the Lottery Winner 🎉</h1>
                &nbsp;
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this._generarGanador()
                }}>
                  <input type="submit"
                    className="bbtn btn-block btn-info btn-sm"
                    value="🤑 WINNER GENERATOR 🤑" />
                </form>
                &nbsp;
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this._ganador()
                }}>
                  <input type="submit"
                    className="bbtn btn-block btn-success btn-sm"
                    value="😎 VIEW WINNER 😎" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Winner;
