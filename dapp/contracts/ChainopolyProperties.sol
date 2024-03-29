pragma solidity ^0.4.24;

import "./openzeppelin/math/SafeMath.sol";
import "./Property.sol";

contract ChainopolyProperties {
    using SafeMath for uint256;

    mapping (uint256 => address) private _tokenOwner;
    mapping (address => uint256) private _ownedTokensCount;
    mapping (uint256 => string) private _tokenURIs;
    mapping (uint256 => Property) private _tokenInfo;
    mapping (uint256 => uint256) private _tokenPosition;
    uint256[] private tokens;
    address _owner;

    event TransferEvent(address _from, address _to, uint256 _value);

    constructor() public {
        _owner = tx.origin;
    }

    /**
     * @dev Gets the balance of the specified address
     * @param owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(address owner) public view returns(uint256) {
      return _ownedTokensCount[owner];
    }

    function tokensOf(address owner) public view returns(uint256[]) {
        uint256[] memory results = new uint256[](tokens.length);
        uint j = 0;
        for(uint i = 0; i < tokens.length; i++) {
            if (_tokenOwner[tokens[i]] == owner) {
                results[j++] = tokens[i];
            }
        }
        return results;
    }

    /**
     * @dev Gets the owner of the specified token ID
     * @param tokenId uint256 ID of the token to query the owner of
     * @return owner address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view returns(address) {
      return _tokenOwner[tokenId];
    }

    event LogEvent(string text, address owner, address sender, uint256 tokenId);
    /**
     * @dev Transfers the ownership of a given token ID to another address
     * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
     * Requires the msg sender to be the owner, approved, or operator
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
    */
    function transfer(
      address to,
      uint256 tokenId
    )
      public
    {
      require(_tokenOwner[tokenId] == msg.sender);
      _removeTokenFrom(msg.sender, tokenId);
      _addTokenTo(to, tokenId);
    }

    /**
     * @dev Returns an URI for a given token ID
     * Throws if the token ID does not exist. May return an empty string.
     * @param tokenId uint256 ID of the token to query
     */
    function tokenURI(uint256 tokenId) external view returns(string) {
      return _tokenURIs[tokenId];
    }

    /**
     * @dev Internal function to set the token URI for a given token
     * Reverts if the token ID does not exist
     * @param tokenId uint256 ID of the token to set its URI
     * @param uri string URI to assign
     */
    function _setTokenURI(uint256 tokenId, string uri) internal {
      _tokenURIs[tokenId] = uri;
    }

    function mintWithTokenURI(
      uint256 tokenId,
      string _tokenURI
    )
      public
      returns (bool)
    {
      _mint(tokenId);
      _setTokenURI(tokenId, _tokenURI);
      return true;
    }

    /**
     * @dev Internal function to mint a new token
     * Reverts if the given token ID already exists
     * @param tokenId uint256 ID of the token to be minted by the msg.sender
     */
    function _mint(uint256 tokenId) internal {
      require(msg.sender == _owner);
      _addTokenTo(msg.sender, tokenId);
      tokens.push(tokenId);
    }

    /**
    * @dev Internal function to add a token ID to the list of a given address
    * Note that this function is left internal to make ERC721Enumerable possible, but is not
    * intended to be called by custom derived contracts: in particular, it emits no Transfer event.
    * @param to address representing the new owner of the given token ID
    * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
    */
    function _addTokenTo(address to, uint256 tokenId) internal {
        require(_tokenOwner[tokenId] == address(0));
        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to] = _ownedTokensCount[to].add(1);
    }

    /**
    * @dev Internal function to remove a token ID from the list of a given address
    * Note that this function is left internal to make ERC721Enumerable possible, but is not
    * intended to be called by custom derived contracts: in particular, it emits no Transfer event,
    * and doesn't clear approvals.
    * @param from address representing the previous owner of the given token ID
    * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
    */
    function _removeTokenFrom(address from, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from);
        _ownedTokensCount[from] = _ownedTokensCount[from].sub(1);
        _tokenOwner[tokenId] = address(0);
    }

    function mintTokenWithInfo(uint256 tokenId, string name, string color, uint256 price, uint256 rent, uint256 position) public {
        require(_tokenInfo[tokenId] == address(0));
        if (_tokenOwner[tokenId] == address(0))
            _mint(tokenId);
        _tokenInfo[tokenId] = new Property(name, color, price, rent, position);
        _tokenPosition[position] = tokenId;
    }

    function getTokenInfo(uint256 tokenId) public view returns(string name, string color, uint256 price, uint256 rent, uint256 position) {
        require(_tokenInfo[tokenId] != address(0));
        return (_tokenInfo[tokenId].getName(), _tokenInfo[tokenId].getColor(), _tokenInfo[tokenId].getPrice(), _tokenInfo[tokenId].getRent(), _tokenInfo[tokenId].getPosition());
    }

    function getTokenContract(uint256 tokenId) public view returns(address) {
        return _tokenInfo[tokenId];
    }

    function getTokenByPosition(uint256 position) public view returns(uint256) {
        return _tokenPosition[position];
    }

    function resetTo(address owner) public {
        _owner = owner;
        for (uint256 i = 0; i < tokens.length; i++) {
            _ownedTokensCount[_tokenOwner[tokens[i]]] = 0;
            _tokenOwner[tokens[i]] = _owner;
        }
        _ownedTokensCount[_owner] = tokens.length;
    }

}
