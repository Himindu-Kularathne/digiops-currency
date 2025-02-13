// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useEffect, useState } from "react";
import { Input, Button, Avatar, message, Spin } from "antd";
import { SearchOutlined, ScanOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./SendAssets.css";
import { isAddress } from "ethereum-address";
import { Col, Row } from "reactstrap";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import {
  ERROR_FETCHING_LOCAL_TX_DETAILS,
  ERROR_RESETTING_TX_VALUES,
  ERROR_SAVING_TX_DETAILS,
  ERROR_RETRIEVE_WALLET_ADDRESS
} from "../../constants/strings";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { STORAGE_KEYS, DEFAULT_WALLET_ADDRESS } from "../../constants/configs";
import { getWalletBalanceByWalletAddress } from "../../services/blockchain.service";

function SendAssets() {
  const navigate = useNavigate();

  // --- Message API ---
  const [messageApi, contextHolder] = message.useMessage();

  const [sendWalletAddress, setSendWalletAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [isValidWalletAddress, setIsValidWalletAddress] = useState(false);
  const [isShowErrorMsg, setIsShowErrorMsg] = useState(false);
  const [walletValidationErrorMsg, setWalletValidationErrorMsg] = useState("");
  const [isCanContinue, setIsCanContinue] = useState(false);

  const [storedSendWalletAddress, setStoredSendWalletAddress] = useState("");
  const [storedSendAmount, setStoredSendAmount] = useState("");

  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      setWalletAddress(walletAddressResponse);
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  const fetchCurrentTokenBalance = async () => {
    try {
      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
      setIsTokenBalanceLoading(false);
    } catch (error) {
      console.log("error while fetching token balance", error);
      setIsTokenBalanceLoading(false);
      setTokenBalance(0);
    }
  };

  useEffect(() => {
    fetchWalletAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
      fetchCurrentTokenBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleSendCancel = () => {
    navigate("/");
  };

  const handleSendAssetsNext = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, sendAmount);
      await saveLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS,
        sendWalletAddress
      );
      navigate("/confirm-assets-send");
    } catch (error) {
      console.log(`${ERROR_SAVING_TX_DETAILS}: ${error}`);
    }
  };

  const handleCancel = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, "");
      await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, "");
      navigate("/");
    } catch (error) {
      console.log(`${ERROR_RESETTING_TX_VALUES}: ${error}`);
    }
  };

  const handleWalletAddressInputChange = (e) => {
    const address = e.target.value;
    setSendWalletAddress(address);

    if (e.target.value === "") {
      setIsShowErrorMsg(false);
    }
  };

  const fetchLocalTxDetails = async () => {
    try {
      const sendingAmount = await getLocalDataAsync(
        STORAGE_KEYS.SENDING_AMOUNT
      );
      const senderWalletAddress = await getLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS
      );
      setStoredSendWalletAddress(senderWalletAddress);
      setStoredSendAmount(sendingAmount);
    } catch (error) {
      console.log(`${ERROR_FETCHING_LOCAL_TX_DETAILS}: ${error}`);
    }
  };

  useEffect(() => {
    fetchLocalTxDetails();
  }, []);

  useEffect(() => {
    if (storedSendWalletAddress || storedSendAmount) {
      setSendWalletAddress(storedSendWalletAddress);
      setSendAmount(storedSendAmount);
    }
  }, [storedSendWalletAddress, storedSendAmount]);

  useEffect(() => {
    if (sendWalletAddress && parseFloat(sendAmount) !== 0) {
      setIsCanContinue(true);
    } else {
      setIsCanContinue(false);
    }
  }, [sendWalletAddress, sendAmount]);

  useEffect(() => {
    setIsValidWalletAddress(isAddress(sendWalletAddress));
    if (isAddress(sendWalletAddress)) {
      setIsShowErrorMsg(false);
      setWalletValidationErrorMsg("");
    } else {
      setIsShowErrorMsg(true);
      setWalletValidationErrorMsg("Please Enter Valid Address");
    }
  }, [sendWalletAddress]);

  return (
    <div className="mx-3">
      {contextHolder}
      <div className="mt-4 d-flex justify-content-between">
        <span className="send-header">Send to</span>
        <Button type="link" onClick={handleSendCancel}>
          Cancel
        </Button>
      </div>
      <Input.Group compact>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search, public address (0x)"
          addonAfter={
            <ScanOutlined style={{ color: "#ffff", fontSize: "18px" }} />
          }
          value={sendWalletAddress}
          onChange={handleWalletAddressInputChange}
          size="large"
        />
      </Input.Group>
      {isShowErrorMsg ? (
        <span className="red-text">{walletValidationErrorMsg}</span>
      ) : (
        <></>
      )}

      {isValidWalletAddress && (
        <div className="mt-5">
          <Row align="left">
            <Col md="4" sm="4" className="asset-column">
              <div className="asset-content">Asset</div>
            </Col>
            <Col md="8" sm="8">
              <div className="send-coin-info">
                <Avatar size={40} src={Wso2MainImg} />
                <div className="send-coin-details d-flex flex-column">
                  <span className="send-coin-name">WSO2</span>
                  <span className="send-coin-balance">
                    Balance:{" "}
                    {isTokenBalanceLoading ? (
                      <Spin size="small" />
                    ) : (
                      tokenBalance
                    )}{" "}
                    WSO2
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          <Row align="left" className="mt-3 mb-4">
            <Col md="4" sm="4" className="asset-column">
              <div className="asset-content">Amount</div>
            </Col>
            <Col md="8" sm="8">
              <div className="send-coin-input-card">
                <Input.Group compact>
                  <Input
                    className="send-coin-input"
                    placeholder="Enter value"
                    suffix="WSO2"
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </Input.Group>
                {/* <span className="send-coin-balance">$0.00 USD</span> */}
              </div>
            </Col>
          </Row>
          <Row className="send-button-section">
            <Col md="6" sm="6">
              <Button block className="default-button" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col md="6" sm="6">
              <Button
                block
                className="primary-button mt-2"
                onClick={handleSendAssetsNext}
                disabled={!isCanContinue}
              >
                Next
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default SendAssets;
