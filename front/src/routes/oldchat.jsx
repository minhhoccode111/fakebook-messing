import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { NumberCounter, StateWrapper } from './../components/more';

import ContactUser from './../components/contact/ContactUser';
import ContactGroup from './../components/contact/ContactGroup';

import FormGroup from './../components/contact/FormGroup';
import FormChat from './../components/chat/FormChat';

import OptionUser from './../components/option/OptionUser';
import OptionGroup from './../components/option/OptionGroup';

import ChatMessage from './../components/chat/ChatMessage';
import ChatHeaderGroup from './../components/chat/ChatHeaderGroup';
import ChatHeaderUser from './../components/chat/ChatHeaderUser';

function useFetchContact() {
  const { loginState } = useOutletContext();
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [isContactError, setIsContactError] = useState(false);
  const [dataContact, setDataContact] = useState({});
  const [willFetchContact, setWillFetchContact] = useState(false);

  // first load all conversations existed
  useEffect(() => {
    async function tmp() {
      try {
        setIsContactLoading(true);

        const [userContactRes, groupContactRes] = await Promise.all([
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/users',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/groups',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
        ]);

        // extract data from responses
        const data = {};
        const statusTable = {
          offline: 0,
          afk: 1,
          busy: 2,
          online: 3,
        };
        // 1 extra step to sort users contact data base on status
        data.users = userContactRes.data.users.sort((a, b) => statusTable[b.status] - statusTable[a.status]);
        data.joinedGroups = groupContactRes.data.joinedGroups;
        data.publicGroups = groupContactRes.data.publicGroups;
        data.privateGroups = groupContactRes.data.privateGroups;

        // console.log(userContactRes.data);
        // console.log(groupContactRes.data);

        // console.log(`the data belike: `, data);
        // console.log(dataContact);

        setDataContact(() => ({ ...data }));
      } catch (error) {
        // console.log(error);

        setIsContactError(true);
      } finally {
        setIsContactLoading(false);
      }
    }

    tmp();
    // flag to re-fetch
  }, [willFetchContact]);

  return { isContactLoading, setIsContactLoading, isContactError, setIsContactError, dataContact, setWillFetchContact };
}

export default function Chat() {
  const { loginState } = useOutletContext();

  // contact data, fetch states, flag to re-fetch
  const { isContactLoading, isContactError, dataContact, setWillFetchContact } = useFetchContact();

  // load a specific chat states
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatError, setIsChatError] = useState(false);

  // an array of messages to display in chat section and also used for authorization undefined means not load yet null means can't read messages, empty [] means can read but no messages yet
  const [chatMessages, setChatMessages] = useState();

  // chat ref to scroll to bottom of the chat when messages is loaded
  const chatRef = useRef(null);
  useEffect(() => {
    const element = chatRef.current;
    // console.log(element);

    if (element) {
      // wait 1 second for images to fully loaded and scroll to bottom
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 1000);
    }
  }, [chatMessages]);

  // an object to display in options section, {info: {}, members:[]}
  // includes info of current user or group, members for group only
  const [chatOptions, setChatOptions] = useState({});

  // identify which chat current logged in user is engaging
  // like :userid or :groupid
  const [chatId, setChatId] = useState('');
  const [chatType, setChatType] = useState('');

  // change chatMessages and chatOptions base on current chat
  useEffect(() => {
    // console.log(`chatId belike: `, chatId);
    // console.log(`chatType belike: `, chatType);

    async function userChat() {
      // console.log(`fetch user chat`);

      try {
        setIsChatLoading(true);

        const res = await axios({
          mode: 'cors',
          method: 'get',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        // console.log(`the messRes.data.messages belike: `, res.data.messages);
        // console.log(`the messRes.data.receivedGroup belike: `, res.data.receivedUser);

        setChatMessages(res.data.messages);
        setChatOptions({ info: res.data.receivedUser });
      } catch (error) {
        // console.log(error);
        // console.log(error.response.status);

        setIsChatError(true);
      } finally {
        setIsChatLoading(false);
      }
    }

    async function groupChat() {
      // console.log(`fetch group chat`);

      try {
        setIsChatLoading(true);

        const [messRes, memRes] = await Promise.all([
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),

          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}/members`,
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
        ]);

        // console.log(`the messRes.data.messages belike: `, messRes.data.messages);
        // console.log(`the messRes.data.receivedGroup belike: `, messRes.data.receivedGroup);
        // console.log(`the memRes.data.groupMembers belike: `, memRes.data.groupMembers);

        setChatMessages(messRes.data.messages);
        setChatOptions({ info: messRes.data.receivedGroup, members: memRes.data.groupMembers });
      } catch (error) {
        // console.log(error);
        // console.log(error.response.status);

        setIsChatError(true);
      } finally {
        setIsChatLoading(false);
      }
    }

    // states are valid then start fetching
    if (chatId && chatType && loginState) {
      // different fetch base on chatType
      if (chatType === 'users') userChat();
      else groupChat();
    }
  }, [chatId, chatType, loginState]);

  // clear current working conversation when dataContact change
  useEffect(() => {
    setChatMessages();
    setChatOptions({});
    setChatId('');
    setChatType('');

    // console.log('cleared current engaging conversation');
  }, [dataContact]);

  // which section to expand
  const [currentOpenSection, setCurrentOpenSection] = useState('');

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  // set current open section when button clicked
  const handleToggleClick = (section) => () => (currentOpenSection === section ? setCurrentOpenSection('') : setCurrentOpenSection(section));

  // based on current open section to return a class, used for <ul>s
  const sectionExpand = (current) => (currentOpenSection === current ? 'max-h-full' : 'max-h-0');

  // based on current open section to return a class, used for toggle buttons
  const sectionHighlight = (current) => (currentOpenSection === current ? 'bg-red-100' : 'bg-red-50');

  // console.log(dataContact);

  const users = dataContact?.users;
  const joinedGroups = dataContact?.joinedGroups ?? [];
  const publicGroups = dataContact?.publicGroups ?? [];
  const privateGroups = dataContact?.privateGroups ?? [];

  const everyGroupNames = [...joinedGroups, ...publicGroups, ...privateGroups]
    // extract name only
    .map((gr) => gr.name)
    // allow to update group with old name
    .filter((name) => name !== chatOptions?.info?.name);
  // console.log(everyGroupNames);

  // console.log(`joinedGroups belike: `, joinedGroups);
  // console.log(`publicGroups belike: `, publicGroups);
  // console.log(`privateGroup belike: `, privateGroups);

  // console.log(`the chatMessages belike: `, chatMessages);
  // console.log(`the chatOptions belike: `, chatOptions);

  return (
    <section className="text-gray-700 p-[1vh] grid grid-cols-chat grid-rows-chat gap-2 max-w-screen-xl mx-auto h-full max-h-full">
      {/* display contact section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-xl p-1 shadow-2xl bg-white max-w-[20rem] max-h-full flex flex-col gap-1">
        {/* other users */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-lg py-2 px-4 text-center w-full rounded-md hover:bg-red-100 transition-all shadow-md' + ' ' + sectionHighlight('users')}
          onClick={handleToggleClick('users')}
        >
          <h2 className="">Users</h2>
          <NumberCounter>{users?.length || 0}</NumberCounter>
        </button>
        {/* ul display other users conversations */}
        <StateWrapper
          isError={isContactError}
          isLoading={isContactLoading}
          containerClassName={'overflow-y-auto transition-all origin-top grid place-items-center text-warn ' + ' ' + sectionExpand('users')}
          childClassName={'text-8xl p-4'}
        >
          <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('users')}>
            {users?.length !== 0 ? (
              users?.map((u) => {
                // to display current chat we are focused
                return <ContactUser chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} user={u} key={u.id} />;
              })
            ) : (
              <li className="px-4 py-2 rounded-lg bg-slate-100 font-bold shadow-sm my-1 text-gray-700">No user to display</li>
            )}
          </ul>
        </StateWrapper>

        {/* joined groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-lg py-2 px-4 text-center w-full rounded-md hover:bg-red-100 transition-all shadow-md' + ' ' + sectionHighlight('joined')}
          onClick={handleToggleClick('joined')}
        >
          <h2 className="">Joined groups</h2>
          <NumberCounter>{joinedGroups?.length || 0}</NumberCounter>
        </button>
        {/* ul to display all joined groups */}
        <StateWrapper
          isError={isContactError}
          isLoading={isContactLoading}
          containerClassName={'overflow-y-auto transition-all origin-top grid place-items-center text-warn ' + ' ' + sectionExpand('joined')}
          childClassName={'text-8xl p-4'}
        >
          <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('joined')}>
            {joinedGroups?.length !== 0 ? (
              joinedGroups?.map((gr) => {
                // to display current chat we are focused
                return <ContactGroup chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
              })
            ) : (
              <li className="px-4 py-2 rounded-lg bg-slate-100 font-bold shadow-sm my-1 text-gray-700">No group to display</li>
            )}
          </ul>
        </StateWrapper>

        {/* public groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-lg py-2 px-4 text-center w-full rounded-md hover:bg-red-100 transition-all shadow-md' + ' ' + sectionHighlight('public')}
          onClick={handleToggleClick('public')}
        >
          <h2 className="">Public groups</h2>
          <NumberCounter>{publicGroups?.length || 0}</NumberCounter>
        </button>
        {/* ul to display all public groups */}
        <StateWrapper
          isError={isContactError}
          isLoading={isContactLoading}
          containerClassName={'overflow-y-auto transition-all origin-top grid place-items-center text-warn ' + ' ' + sectionExpand('public')}
          childClassName={'text-8xl p-4'}
        >
          <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('public')}>
            {publicGroups?.length !== 0 ? (
              publicGroups?.map((gr) => {
                // to display current chat we are focused
                return <ContactGroup chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
              })
            ) : (
              <li className="px-4 py-2 rounded-lg bg-slate-100 font-bold shadow-sm my-1 text-gray-700">No group to display</li>
            )}
          </ul>
        </StateWrapper>

        {/* private groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-lg py-2 px-4  text-center w-full rounded-md hover:bg-red-100 transition-all shadow-md' + ' ' + sectionHighlight('private')}
          onClick={handleToggleClick('private')}
        >
          <h2 className="">Private groups</h2>
          <NumberCounter>{privateGroups?.length || 0}</NumberCounter>
        </button>
        {/* ul to display all private groups */}
        <StateWrapper
          isError={isContactError}
          isLoading={isContactLoading}
          containerClassName={'overflow-y-auto transition-all origin-top grid place-items-center text-warn ' + ' ' + sectionExpand('private')}
          childClassName={'text-8xl p-4'}
        >
          <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('private')}>
            {privateGroups?.length !== 0 ? (
              privateGroups?.map((gr) => {
                // to display current chat we are focused
                return <ContactGroup chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
              })
            ) : (
              <li className="px-4 py-2 rounded-lg bg-slate-100 font-bold shadow-sm my-1 text-gray-700">No group to display</li>
            )}
          </ul>
        </StateWrapper>

        {/* new group */}
        {/* button to toggle expand form */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-lg py-2 px-4 text-center w-full rounded-md hover:bg-red-100 transition-all shadow-md' + ' ' + sectionHighlight('new')}
          onClick={handleToggleClick('new')}
        >
          <h2 className="">New group</h2>
          <NumberCounter>
            <FaPlus className="text-white font-bold" />
          </NumberCounter>
        </button>
        {/* form to create new group */}
        <div className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('new')}>
          {/* to switch flag and fetch contacts again after creating a group */}
          <FormGroup everyGroupNames={everyGroupNames} setWillFetchContact={setWillFetchContact} />
        </div>
      </article>

      {/* display chat section */}
      <article className="h-full shadow-gray-400 rounded-xl shadow-2xl bg-white flex flex-col justify-between">
        {/* header to know which conversation we are engaging */}

        <StateWrapper isError={isChatError} isLoading={isChatLoading} containerClassName={'p-4 border-b-2 border-gray-700 grid place-items-center text-warn'} childClassName={'text-4xl'}>
          <header className="p-4 border-b-2 border-black">
            {chatType === '' ? (
              <h2 className="font-bold text-xl text-center"> Select a conversation to get started.</h2>
            ) : chatType === 'groups' ? (
              // {info: {}, members: []}
              <ChatHeaderGroup chatOptions={chatOptions} />
            ) : (
              <ChatHeaderUser chatOptions={chatOptions} />
            )}
          </header>
        </StateWrapper>

        {/* display messages section */}
        <StateWrapper isError={isChatError} isLoading={isChatLoading} containerClassName={'overflow-y-auto flex-1 grid place-items-center p-4 text-warn'} childClassName={'text-8xl'}>
          <ul ref={chatRef} className="overflow-y-auto flex-1 flex flex-col gap-4 p-2 ">
            {/* not select conversation */}
            {chatMessages === undefined ? (
              <></>
            ) : // not joined groups
            chatMessages === null ? (
              <li className="p-4 font-bold text-xl text-center text-danger">You are not allowed to read messages in this group.</li>
            ) : // [] means no messages exist
            !chatMessages?.length ? (
              <li className="p-4 font-bold text-xl text-center">
                <p className="">No messages here yet.</p>
                <p className="">Be the first one to say hi.</p>
              </li>
            ) : (
              // display messages, 2 avatars to display with messages
              chatMessages?.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
          </ul>
        </StateWrapper>

        {/* form to send message section, only for allowed conversation */}
        {chatMessages && (
          <div className="p-4 border-t-2 border-black">
            <FormChat chatId={chatId} chatType={chatType} setChatMessages={setChatMessages} />
          </div>
        )}
      </article>

      <StateWrapper
        isError={isChatError}
        isLoading={isChatLoading}
        containerClassName={'overflow-y-auto shadow-gray-400 rounded-xl p-1 shadow-2xl bg-white grid place-items-center text-warn'}
        childClassName={'text-8xl'}
      >
        <article className="overflow-y-auto shadow-gray-400 rounded-xl p-1 shadow-2xl bg-white">
          {/* base on chat type to display option */}
          {chatType === 'groups' && (
            // {info: {}, members: []}
            <OptionGroup
              // to know if current logged in user is a member of group
              chatId={chatId}
              // to jump to inbox with a member in a group
              setChatId={setChatId}
              setChatType={setChatType}
              // fetch data again if current logged in user leave group
              setWillFetchContact={setWillFetchContact}
              // to display group's info and to update members if current logged in user kick someone in the group
              chatOptions={chatOptions}
              setChatOptions={setChatOptions}
              // prevent update to existed name
              everyGroupNames={everyGroupNames}
            />
          )}

          {chatType === 'users' && <OptionUser chatOptions={chatOptions} />}
        </article>
      </StateWrapper>
    </section>
  );
}
