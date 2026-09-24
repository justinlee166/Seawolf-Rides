import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { BottomTabBar, MainTab } from './src/components/BottomTabBar';
import {
  commuterResultFixtures,
  conversationFixtures,
  scheduledRideFixtures,
} from './src/prototypeData/fixtures';
import { ChatsScreen } from './src/screens/ChatsScreen';
import { ConversationScreen } from './src/screens/ConversationScreen';
import { MatchDetailScreen } from './src/screens/MatchDetailScreen';
import { MatchResultsScreen } from './src/screens/MatchResultsScreen';
import { MatchScreen } from './src/screens/MatchScreen';
import { ScheduledRideDetailScreen } from './src/screens/ScheduledRideDetailScreen';
import { ScheduleScreen } from './src/screens/ScheduleScreen';
import { colors } from './src/theme';

type MatchView =
  | { name: 'search' }
  | { name: 'results' }
  | { name: 'detail'; commuteId: string };

type ScheduleView = { name: 'list' } | { name: 'detail'; rideId: string };
type ChatsView = { name: 'inbox' } | { name: 'conversation'; chatId: string };

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('match');
  const [matchView, setMatchView] = useState<MatchView>({ name: 'search' });
  const [scheduleView, setScheduleView] = useState<ScheduleView>({ name: 'list' });
  const [chatsView, setChatsView] = useState<ChatsView>({ name: 'inbox' });
  const [requestedCommuteIds, setRequestedCommuteIds] = useState<string[]>([]);

  function selectMainTab(tab: MainTab) {
    setActiveTab(tab);
    if (tab === 'match') {
      setMatchView({ name: 'search' });
    } else if (tab === 'schedule') {
      setScheduleView({ name: 'list' });
    } else {
      setChatsView({ name: 'inbox' });
    }
  }

  function openChatFromRide(chatId: string) {
    setChatsView({ name: 'conversation', chatId });
    setActiveTab('chats');
  }

  function renderMatch() {
    if (matchView.name === 'results') {
      return (
        <MatchResultsScreen
          onBack={() => setMatchView({ name: 'search' })}
          onViewCommute={(commuteId) => setMatchView({ name: 'detail', commuteId })}
          results={commuterResultFixtures}
        />
      );
    }

    if (matchView.name === 'detail') {
      const commute = commuterResultFixtures.find(
        (fixture) => fixture.id === matchView.commuteId,
      );

      if (commute) {
        return (
          <MatchDetailScreen
            commute={commute}
            onBack={() => setMatchView({ name: 'results' })}
            onRequestRide={() => {
              // Frontend-only M2 state. No request is sent to Firebase.
              setRequestedCommuteIds((current) =>
                current.includes(commute.id) ? current : [...current, commute.id],
              );
            }}
            requestSent={requestedCommuteIds.includes(commute.id)}
          />
        );
      }
    }

    return <MatchScreen onFindCommuters={() => setMatchView({ name: 'results' })} />;
  }

  function renderSchedule() {
    if (scheduleView.name === 'detail') {
      const ride = scheduledRideFixtures.find(
        (fixture) => fixture.id === scheduleView.rideId,
      );

      if (ride) {
        return (
          <ScheduledRideDetailScreen
            onBack={() => setScheduleView({ name: 'list' })}
            onMessageDriver={openChatFromRide}
            ride={ride}
          />
        );
      }
    }

    return (
      <ScheduleScreen
        onViewRide={(rideId) => setScheduleView({ name: 'detail', rideId })}
        rides={scheduledRideFixtures}
      />
    );
  }

  function renderChats() {
    if (chatsView.name === 'conversation') {
      const conversation = conversationFixtures.find(
        (fixture) => fixture.preview.id === chatsView.chatId,
      );

      if (conversation) {
        return (
          <ConversationScreen
            conversation={conversation}
            onBack={() => setChatsView({ name: 'inbox' })}
          />
        );
      }
    }

    return (
      <ChatsScreen
        chats={conversationFixtures.map((conversation) => conversation.preview)}
        onOpenChat={(chatId) => setChatsView({ name: 'conversation', chatId })}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {activeTab === 'match' && renderMatch()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'chats' && renderChats()}
      </View>
      <BottomTabBar activeTab={activeTab} onSelect={selectMainTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
