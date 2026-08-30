import React, { useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView, Animated, PanResponder } from 'react-native';
import { useOutfitsStore } from '../../stores/outfits-store';

const rewardIcon = require('../../assets/acessories/reward.png');
const hatIcon = require('../../assets/acessories/hat.png');
const shirtIcon = require('../../assets/acessories/shirt.png');
const birthdayHat = require('../../assets/acessories/birthday hat.png');
const jewelBlue = require('../../assets/acessories/jewel-blue.png');
const jewelRed = require('../../assets/acessories/jewel-red.png');

interface RewardPopupProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'hat' | 'shirt';

const STORE_ITEMS = [
  { id: '1', name: 'Birthday Hat', image: birthdayHat, category: 'hat', theme: 'Birthday' },
  { id: '2', name: 'Jewel Red', image: jewelRed, category: 'shirt', theme: 'Jewel' },
  { id: '3', name: 'Jewel Blue', image: jewelBlue, category: 'shirt', theme: 'Jewel' },
];

export default function RewardPopup({ visible, onClose }: RewardPopupProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { equippedHat, equippedShirt, toggleHat, toggleShirt } = useOutfitsStore();

  const filteredItems = activeTab === 'all' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === activeTab);

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.theme]) acc[item.theme] = [];
    acc[item.theme].push(item);
    return acc;
  }, {} as Record<string, typeof STORE_ITEMS>);

  const panY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 1) {
          Animated.timing(panY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            panY.setValue(0);
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        
        <Animated.View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingTop: 16,
            paddingBottom: 40,
            minHeight: '60%',
            maxHeight: '85%',
            transform: [{ translateY: panY }],
          }}
        >
          {/* Handle */}
          <View {...panResponder.panHandlers} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <View className="w-14 h-1 bg-[#E0E0E0] rounded-full mb-4" />
          </View>

          {/* Custom Tabs */}
          <View className="flex-row items-center justify-between px-16 mb-8 mt-2">
            <TouchableOpacity 
              onPress={() => setActiveTab('all')}
              className="p-2"
            >
              <Image 
                source={rewardIcon} 
                style={{ 
                  width: activeTab === 'all' ? 68 : 50, 
                  height: activeTab === 'all' ? 68 : 50,
                  tintColor: activeTab === 'all' ? undefined : '#B0B0B0',
                  opacity: activeTab === 'all' ? 1 : 0.6
                }} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setActiveTab('hat')}
              className="p-2"
            >
              <Image 
                source={hatIcon} 
                style={{ 
                  width: activeTab === 'hat' ? 56 : 40, 
                  height: activeTab === 'hat' ? 56 : 40,
                  tintColor: activeTab === 'hat' ? undefined : '#B0B0B0',
                  opacity: activeTab === 'hat' ? 1 : 0.6
                }} 
                resizeMode="contain" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('shirt')}
              className="p-2"
            >
              <Image 
                source={shirtIcon} 
                style={{ 
                  width: activeTab === 'shirt' ? 56 : 40, 
                  height: activeTab === 'shirt' ? 56 : 40,
                  tintColor: activeTab === 'shirt' ? undefined : '#B0B0B0',
                  opacity: activeTab === 'shirt' ? 1 : 0.6
                }} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>

          <View className="h-[1px] bg-[#E5E5E5] w-full mb-6" />

          {/* Grid Content */}
          <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
            {Object.keys(groupedItems).map(category => (
              <View key={category} className="mb-6">
                <Text className="font-jakarta-bold text-[16px] text-[#999999] capitalize mb-4">
                  {category} {'>'}
                </Text>
                <View className="flex-row flex-wrap gap-x-[5%] gap-y-6">
                  {groupedItems[category].map(item => {
                    const isEquipped = item.category === 'hat' ? equippedHat === item.id : equippedShirt === item.id;
                    return (
                      <TouchableOpacity 
                        key={item.id} 
                        onPress={() => item.category === 'hat' ? toggleHat(item.id) : toggleShirt(item.id)}
                        activeOpacity={0.7}
                        className={`w-[30%] items-center justify-center rounded-3xl ${isEquipped ? 'border-2 border-[#D7385E] bg-[#FFF5F7]' : 'border-2 border-transparent'}`}
                        style={{ aspectRatio: 1 }}
                      >
                        <Image 
                          source={item.image} 
                          style={{ width: '80%', height: '80%' }} 
                          resizeMode="contain" 
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

        </Animated.View>
      </View>
    </Modal>
  );
}
