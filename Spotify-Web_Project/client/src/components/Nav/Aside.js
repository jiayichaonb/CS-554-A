import React, {useState, useEffect} from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import {FaGem, FaHeart} from 'react-icons/fa';
import {MdSearch, MdHome} from "react-icons/md";
import {FiLogOut} from "react-icons/fi";
import {IoIosPeople} from "react-icons/io";
import {BsFillMusicPlayerFill} from "react-icons/bs";
import sidebarBg from '../Nav/assets/bg1.jpg';

const Aside = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const e = window.sessionStorage.getItem("userEmail");
  const [userEmail, setUserEmail] = useState(e);
  let card = null;
  useEffect(() => {
    onLoadAgain();
  }, [e]);

  async function onLoadAgain() {
    if (userEmail) {
      userHasAuthenticated(true);
    } else {
      console.log("user email is empty");
      userHasAuthenticated(false);
    }
  }

  function handleLogout() {
    window.sessionStorage.setItem("userEmail", "");
    userHasAuthenticated(false);
    window.location.reload(false);
  }

  const buildCard = (letter) => {
    let url = '/searchsingers/' + letter;
    return (
        <MenuItem key={letter}> <a href={url}> {letter} </a></MenuItem>
    );
  };
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];
  card = letters.map((letter) => {
    return buildCard(letter);
  });
  return (
      <div className='Proside'>
        <ProSidebar image={sidebarBg}>
          <SidebarHeader>
            <div
                style={{
                  padding: '17px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 14,
                  letterSpacing: '1px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
            >
              Music Website
            </div>
          </SidebarHeader>

          <SidebarContent>
            <Menu iconShape="circle">
              <MenuItem icon={<MdHome/>}>
                <a href="/">
                  Home
                </a>
              </MenuItem>
              <MenuItem icon={<MdSearch/>}>
                <a href="/search">
                  Search
                </a>
              </MenuItem>
              <MenuItem icon={<BsFillMusicPlayerFill/>}>
                <a href="/categories">
                  All Categories
                </a>
              </MenuItem>
              <MenuItem icon={<FaGem/>}>
                <a href="/newRelease">
                  New Release
                </a>
              </MenuItem>
              <MenuItem icon={<FaHeart/>}>
                <a href="/likedpage">
                  Favorite List
                </a>
              </MenuItem>
              <SubMenu
                  title={'Singers'}
                  icon={<IoIosPeople/>}
              >
                {card}
              </SubMenu>
            </Menu>
          </SidebarContent>

          <SidebarFooter style={{textAlign: 'center'}}>
            <Menu iconShape="circle">
              <MenuItem icon={<FaGem/>}>
                <a href="/account">
                  My Account
                </a>
              </MenuItem>
            </Menu>
            <div
                className="sidebar-btn-wrapper"
                style={{
                  padding: '20px 24px',
                }}
            >
              <a
                  href="/"
                  onClick={handleLogout}
                  target="_blank"
                  className="sidebar-btn"
                  rel="noopener noreferrer"
              >
                <FiLogOut/>
                Sign out
              </a>
            </div>
          </SidebarFooter>
        </ProSidebar>
      </div>
  );
};

export default Aside;
