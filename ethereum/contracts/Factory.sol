pragma solidity ^0.8.0;

contract MusicPlatform {
    uint payPerViewValue;
    uint payPerListenValue;
    uint advViews = 0;
    address payable advertisementFund;
    address payable companyFund;
    address payable musicianFund;
    uint256 public totalDeposited;
    event FundsReceived(address sender, uint256 amount);

    struct Owner {
        string bandName;
        address fundAddress;
        uint counter;
    }
    
    mapping (address => Owner) owners;
    mapping (string => address) musicFiles;
    
    constructor() {
        // advertisementFund = payable(msg.sender);
    }

    function deposit() external payable {
        // Handle the received funds
        uint256 amount = msg.value;

        // Update the contract state
        totalDeposited += amount;

        emit FundsReceived(msg.sender, amount);
    }

    function getMusicianValue() public view returns (uint) {
        return musicianFund.balance;
    }

    function setMusicianFund(address payable _fund) public {
        musicianFund =_fund;
    }

    function getPayPerListenValue() public view returns (uint) {
        return payPerListenValue;
    }

    function setPayPerListenValue(uint _amount) public {
        payPerListenValue = _amount;
    }

    function setPayPerViewValue(uint _amount) public {
        payPerViewValue = _amount;
    }
    
    function getPayPerViewValue() public view returns (uint) {
        return payPerViewValue;
    }
    

    function setCompanyFund(address payable _fund) public {
        companyFund =   _fund;
    }

    function setMarketingFund(address payable _fund) public {
        advertisementFund =   _fund;
    }

    function getAdvertisementFundValue() public view returns (uint) {
        return advertisementFund.balance;
    }
    

    function getCompanyFundValue() public view returns (uint) {
        return companyFund.balance;
    }
    
    function increaseView() public {
        advViews++;
    }

    function payToAddress(address payable recipient) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        recipient.transfer(msg.value);
    }
    
    function getViews() public view returns (uint) {
        return advViews;
    }
}
