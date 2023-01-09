import React, { Component } from 'react';
import smart_contract from '../abis/loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import { Container } from 'react-bootstrap';

class Tokens extends Component {

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

  _balanceTokens = async () => {
    try {
      console.log("Balance de tokens...")
      const _balance = await this.state.contract.methods.balanceTokens(this.state.account).call()
      Swal.fire({
        icon: 'info',
        title: 'User Token Balance :',
        width: 800,
        padding: '3em',
        text: `${_balance} tokens 🎫`,
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

  _balanceTokensSC = async () => {
    try {
      console.log("Balance tokens Smart Contract...")
      const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call()
      Swal.fire({
        icon: 'info',
        title: 'Balance of tokens in the Lottery:',
        width: 800,
        padding: '3em',
        text: `${_balanceTokensSC} tokens`,
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

  _balanceEthersSC = async () => {
    try {
      console.log("Balance Bnb...")
      const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call()
      Swal.fire({
        icon: 'info',
        title: 'Balance of BNBs:',
        width: 800,
        padding: '3em',
        text: `${_balanceEthersSC / 1e18} BNBs 💰`,
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

  _compraTokens = async (_numTokens) => {
    try {
      console.log("Buy tokens ...")
      const precio = await this.state.contract.methods.precioTokens(_numTokens).call()
      const web3 = window.web3
      const ethers = web3.utils.toWei(precio) / 1e18
      await this.state.contract.methods.compraTokens(_numTokens).send({
        from: this.state.account,
        value: ethers 
      })
      Swal.fire({
        icon: 'success',
        title: '¡Purchase of tokens made!',
        width: 800,
        padding: '3em',
        text: `You have bought ${_numTokens} token/s for a value of ${ethers / 1e18} BNB/s`,
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

  _devolverTokens = async (_numTokens) => {
    try {
      console.log("Devolucion de tokens ERC-20 en ejecucion...")
      await this.state.contract.methods.devolverTokens(_numTokens).send({
        from: this.state.account
      })
      Swal.fire({
        icon: 'warning',
        title: '¡Devolución de tokens ERC-20!',
        width: 800,
        padding: '3em',
        text: `Has devuelto ${_numTokens} token/s`,
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
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-25">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center text-white">
              <div className="content mr-auto ml-auto">
                <h1>Token Sale</h1>
                &nbsp;
                <Container>
                  <Row>
                    <Col sm >
                      <h3> Purchased Tokens </h3>
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        this._balanceTokens()
                      }} >
                        <input type="submit"
                          className="bbtn btn-block btn-success btn-sm"
                          value="🎫 BALANCE OF TOKENS 🎫" />
                      </form>
                  
                    </Col>
                    <Col sm >
                      <h3> Good Luck🍀</h3>
                     
                  
                    </Col>
                    &nbsp;&nbsp; &nbsp;&nbsp;
                    <Col sm>
                      <h3> Accumulated BNB </h3>
                      <form onSubmit={(event) => {
                        event.preventDefault()
                        this._balanceEthersSC()
                      }}>
                        <input type="submit"
                          className="bbtn btn-block btn-danger btn-sm"
                          value="💰 BALANCE OF BNB 💰 " />
                      </form>
                    </Col>
                  </Row>
                </Container>

                &nbsp;

                <h3>BUY TOKENS</h3>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const cantidad = this._numTokens.value
                  this._compraTokens(cantidad)
                }}>
                  <input type="number"
                    className="form-control mb-1"
                    placeholder="Amount of tokens to buy"
                    ref={(input) => this._numTokens = input} />

                  <input type="submit"
                    className="bbtn btn-block btn-primary btn-sm"
                    value="BUY TOKENS" />
                </form>

                &nbsp;

                <h3>TOKENS TO DISPOSE</h3>
                <form onSubmit={(event) => {
                  event.preventDefault()
                 this._balanceTokensSC()
                }}>
                  <input type="submit"
                          className="bbtn btn-block btn-danger btn-sm"
                          value="🎟 BALANCE OF TOKENS IN THE LOTTERY 🎟 " />
                      
                </form>
               

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
