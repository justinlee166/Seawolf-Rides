import { router } from 'expo-router';

import { conversationFixtures } from '../../../prototypeData/fixtures';
import { ChatsScreen } from '../../../screens/ChatsScreen';

export default function ChatsRoute() {
  return (
    <ChatsScreen
      chats={conversationFixtures.map((conversation) => conversation.preview)}
      onOpenChat={(chatId) => router.push(`/inbox/${chatId}`)}
    />
  );
}
