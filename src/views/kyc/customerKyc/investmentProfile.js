import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "antd";
import _ from "underscore";

import { defaultValues } from "../../../constants/defaultValues";
import { useInsideAuthApi } from "../../../contextProviders/apiProvider";

import Loader from "../../../sharedComponents/Loader";
import { Button } from "../../../sharedComponents/button";

import Title from "../customerKycForm/title";
import InvestmentProfile from "../customerKycForm/investmentProfileForm/investmentForm";
import RiskTolerance from "../customerKycForm/investmentProfileForm/riskTolerance";
import Aml from "../customerKycForm/investmentProfileForm/aml";

import {
  storeKycData,
  getKycData,
  getInvestmentPayload,
  updateKycData,
} from "../customerKycForm/investmentProfileForm/investment";

import { FloatRightButtonCol } from "../sharedComponents/style";
import { StyledBottomButton } from "../sharedComponents/style";

let initialValues = {};

const InvestmentProfileDetails = ({
  nextStep,
  backStep,
  onFinishFailed,
  steps3DropDown,
  isStep,
  getSelectedObj,
  getDropdownValue,
  getDropdownName,
  userType,
}) => {
  const { connectWithApi } = useInsideAuthApi();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [dropdownLoader, setDropdownLoader] = useState(true);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [liquidNetWorth, setLiquidNetWorth] = useState([]);
  const [totalNetWorth, setTotalNetWorth] = useState([]);
  const [transactionFrequency, setTransactionFrequency] = useState([]);
  const [fundSource, setFundSource] = useState([]);
  const [globaliseDeposit, setGlobaliseDeposit] = useState([]);
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [isData, setIsData] = useState(false);
  const [investmentProfileData, setInvestmentProfileData] = useState();
  const [investmentProfileDataId, setInvestmentProfileDataId] = useState();
  const [apiPayload, setApiPayload] = useState();

  const submitInvestmentForm = (values) => {
    setIsLoading(true);
    const payload = getInvestmentPayload(
      values,
      getSelectedObj,
      userType,
      fundSource,
      getDropdownValue,
      defaultValues,
      annualIncome,
      liquidNetWorth,
      totalNetWorth,
      transactionFrequency,
      globaliseDeposit,
      investmentHistory
    );
    if (_.isEqual(apiPayload, payload)) {
      setIsLoading(false);
      nextStep();
    } else {
      if (isData) {
        const params = `${investmentProfileDataId}`;
        updateKycData(connectWithApi, payload, setIsLoading, nextStep, params);
      } else {
        storeKycData(connectWithApi, payload, setIsLoading, nextStep);
      }
    }
  };

  useEffect(() => {
    const params = `kyc_type=${userType}&kyc_step=step3`;
    getKycData(
      connectWithApi,
      setIsData,
      setInvestmentProfileData,
      setInvestmentProfileDataId,
      setDropdownLoader,
      userType,
      setApiPayload,
      params
    );
  }, [isData]);

  useEffect(() => {
    if (isStep) {
      setFundSource(steps3DropDown?.fund_source);
      setAnnualIncome(steps3DropDown?.annual_income);
      setLiquidNetWorth(steps3DropDown?.liquid_net_worth);
      setTotalNetWorth(steps3DropDown?.total_net_worth);
      setTransactionFrequency(steps3DropDown?.transaction_frequency);
      setGlobaliseDeposit(steps3DropDown?.globalise_deposit);
      setInvestmentHistory(steps3DropDown?.investment_history);
    }
  }, [isStep]);

  return (
    <React.Fragment>
      <Form
        layout="vertical"
        onFinish={submitInvestmentForm}
        onFinishFailed={onFinishFailed}
        hideRequiredMark
        initialValues={initialValues}
        form={form}
      >
        {dropdownLoader ? (
          <Row justify="center">
            <Col>
              <Loader size="large" spinning={dropdownLoader} />
            </Col>
          </Row>
        ) : (
          <React.Fragment>
            <Title title="Investment Profile" />
            <InvestmentProfile
              annualIncome={annualIncome}
              liquidNetWorth={liquidNetWorth}
              totalNetWorth={totalNetWorth}
              form={form}
              investmentProfileData={investmentProfileData}
              investmentExperience={defaultValues.investmentExperience}
              planTotrade={defaultValues.planTotrade}
              getDropdownName={getDropdownName}
            />
            <RiskTolerance
              form={form}
              getSelectedObj={getSelectedObj}
              investmentProfileData={investmentProfileData}
              riskTolerance={defaultValues.riskTolerance}
              getDropdownName={getDropdownName}
            />
            <Aml
              transactionFrequency={transactionFrequency}
              fundSource={fundSource}
              globaliseDeposit={globaliseDeposit}
              investmentHistory={investmentHistory}
              form={form}
              getSelectedObj={getSelectedObj}
              investmentProfileData={investmentProfileData}
            />
            <StyledBottomButton>
              <FloatRightButtonCol span={12}>
                <Button size="md-1" outlined={true} onClick={backStep}>
                  Back
                </Button>
              </FloatRightButtonCol>
              <Col span={11}>
                <Button loading={isLoading} htmlType="submit" size="md-1">
                  Next
                </Button>
              </Col>
            </StyledBottomButton>
          </React.Fragment>
        )}
      </Form>
    </React.Fragment>
  );
};

export default InvestmentProfileDetails;
