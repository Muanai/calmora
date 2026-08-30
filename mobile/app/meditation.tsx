import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

// Assets
import mascotHoldHeart from '../assets/meditation/mascot-hold-heart.png';
import mascotHugHeart from '../assets/meditation/mascot-hug-heart.png';
import mascotMotivated from '../assets/meditation/mascot-motivated.png';
import mascotMorning from '../assets/meditation/mascot-morning.png';
import mascotBlanket from '../assets/meditation/mascot-blanket.png';

// SVGs
const StarBlueIcon = () => (
  <Svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <Path d="M0.113793 3.70852e-05L4.01071 1.86086L7.95997 0.113867L6.09915 4.01079L7.84614 7.96004L3.94922 6.09922L-3.70852e-05 7.84621L1.86079 3.9493L0.113793 3.70852e-05Z" fill="#498290"/>
  </Svg>
);



const StarWhiteIcon = ({ size = 8 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
    <Path d="M0.113793 3.70852e-05L4.01071 1.86086L7.95997 0.113867L6.09915 4.01079L7.84614 7.96004L3.94922 6.09922L-3.70852e-05 7.84621L1.86079 3.9493L0.113793 3.70852e-05Z" fill="white"/>
  </Svg>
);

const PlayIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M8 5.14001V19.14L19 12.14L8 5.14001Z" fill={color} />
  </Svg>
);

const IconSemua = ({ color, width = 27, height = 27 }: { color?: string; width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 27 27" fill="none">
    <Path d="M9.5 1.5H2.83333C2.47971 1.5 2.14057 1.64048 1.89052 1.89052C1.64048 2.14057 1.5 2.47971 1.5 2.83333V9.5C1.5 9.85362 1.64048 10.1928 1.89052 10.4428C2.14057 10.6929 2.47971 10.8333 2.83333 10.8333H9.5C9.85362 10.8333 10.1928 10.6929 10.4428 10.4428C10.6929 10.1928 10.8333 9.85362 10.8333 9.5V2.83333C10.8333 2.47971 10.6929 2.14057 10.4428 1.89052C10.1928 1.64048 9.85362 1.5 9.5 1.5ZM9.5 16.1667H2.83333C2.47971 16.1667 2.14057 16.3071 1.89052 16.5572C1.64048 16.8072 1.5 17.1464 1.5 17.5V24.1667C1.5 24.5203 1.64048 24.8594 1.89052 25.1095C2.14057 25.3595 2.47971 25.5 2.83333 25.5H9.5C9.85362 25.5 10.1928 25.3595 10.4428 25.1095C10.6929 24.8594 10.8333 24.5203 10.8333 24.1667V17.5C10.8333 17.1464 10.6929 16.8072 10.4428 16.5572C10.1928 16.3071 9.85362 16.1667 9.5 16.1667ZM24.1667 1.5H17.5C17.1464 1.5 16.8072 1.64048 16.5572 1.89052C16.3071 2.14057 16.1667 2.47971 16.1667 2.83333V9.5C16.1667 9.85362 16.3071 10.1928 16.5572 10.4428C16.8072 10.6929 17.1464 10.8333 17.5 10.8333H24.1667C24.5203 10.8333 24.8594 10.6929 25.1095 10.4428C25.3595 10.1928 25.5 9.85362 25.5 9.5V2.83333C25.5 2.47971 25.3595 2.14057 25.1095 1.89052C24.8594 1.64048 24.5203 1.5 24.1667 1.5ZM24.1667 16.1667H17.5C17.1464 16.1667 16.8072 16.3071 16.5572 16.5572C16.3071 16.8072 16.1667 17.1464 16.1667 17.5V24.1667C16.1667 24.5203 16.3071 24.8594 16.5572 25.1095C16.8072 25.3595 17.1464 25.5 17.5 25.5H24.1667C24.5203 25.5 24.8594 25.3595 25.1095 25.1095C25.3595 24.8594 25.5 24.5203 25.5 24.1667V17.5C25.5 17.1464 25.3595 16.8072 25.1095 16.5572C24.8594 16.3071 24.5203 16.1667 24.1667 16.1667Z" stroke={color} strokeWidth="3" strokeLinejoin="round"/>
  </Svg>
);

export const IconRileks = ({ color, width = 32, height = 28 }: { color?: string; width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 32 28" fill="none">
    <Path d="M16 28C15.52 28 15.0603 27.916 14.6208 27.748C14.1813 27.58 13.7877 27.327 13.44 26.9889L3.32 17.1111H7.84L15.72 24.7722C15.7733 24.8241 15.8203 24.8567 15.8608 24.8702C15.9013 24.8837 15.9477 24.8899 16 24.8889C16.0523 24.8878 16.0992 24.8816 16.1408 24.8702C16.1824 24.8588 16.2288 24.8261 16.28 24.7722L26.96 14.35C27.5733 13.7537 28.04 13.0475 28.36 12.2313C28.68 11.4152 28.84 10.5788 28.84 9.72222C28.7867 7.93333 28.1733 6.39696 27 5.11311C25.8267 3.82926 24.36 3.18785 22.6 3.18889C21.7733 3.18889 20.9803 3.34444 20.2208 3.65555C19.4613 3.96667 18.8011 4.42037 18.24 5.01666L17.16 6.14444C17.0267 6.3 16.8533 6.42341 16.64 6.51467C16.4267 6.60592 16.2133 6.65104 16 6.65C15.7867 6.64896 15.5733 6.60385 15.36 6.51467C15.1467 6.42548 14.96 6.30207 14.8 6.14444L13.72 5.01666C13.16 4.42037 12.5067 3.9537 11.76 3.61667C11.0133 3.27963 10.2133 3.11111 9.36 3.11111C7.92 3.11111 6.6736 3.55859 5.6208 4.45355C4.568 5.34852 3.85387 6.45659 3.4784 7.77778H0.1984C0.651733 5.57407 1.712 3.72711 3.3792 2.23689C5.0464 0.746667 7.04 0.00103704 9.36 0C10.64 0 11.8469 0.246296 12.9808 0.738889C14.1147 1.23148 15.1211 1.91852 16 2.8C16.8533 1.91852 17.8469 1.23148 18.9808 0.738889C20.1147 0.246296 21.3211 0 22.6 0C25.2667 0 27.5003 0.959259 29.3008 2.87778C31.1013 4.79629 32.0011 7.07778 32 9.72222C32 10.9926 31.7733 12.2111 31.32 13.3778C30.8667 14.5444 30.1867 15.5815 29.28 16.4889L18.52 26.9889C18.1733 27.3259 17.7867 27.579 17.36 27.748C16.9333 27.917 16.48 28.001 16 28ZM15.8 14H0V10.8889H22.2C22.6533 10.8889 23.0336 10.7396 23.3408 10.4409C23.648 10.1422 23.8005 9.77303 23.7984 9.33333C23.7963 8.89363 23.6427 8.52444 23.3376 8.22578C23.0325 7.92711 22.6533 7.77778 22.2 7.77778C21.8267 7.77778 21.4933 7.87526 21.2 8.07022C20.9067 8.26518 20.72 8.54363 20.64 8.90555L17.56 8.08889C17.8533 7.07778 18.4267 6.25437 19.28 5.61867C20.1333 4.98296 21.1067 4.66563 22.2 4.66667C23.5333 4.66667 24.6667 5.12037 25.6 6.02778C26.5333 6.93518 27 8.03703 27 9.33333C27 10.6296 26.5333 11.7315 25.6 12.6389C24.6667 13.5463 23.5333 14 22.2 14H20.32C20.4 14.2593 20.4667 14.5123 20.52 14.7591C20.5733 15.0059 20.6 15.2714 20.6 15.5556C20.6 16.8518 20.1333 17.9537 19.2 18.8611C18.2667 19.7685 17.1333 20.2222 15.8 20.2222C14.7067 20.2222 13.7333 19.9049 12.88 19.2702C12.0267 18.6355 11.4533 17.8121 11.16 16.8L14.24 15.9833C14.32 16.3463 14.5067 16.6253 14.8 16.8202C15.0933 17.0152 15.4267 17.1121 15.8 17.1111C16.2533 17.1111 16.6336 16.9618 16.9408 16.6631C17.248 16.3644 17.4011 15.9953 17.4 15.5556C17.3989 15.1158 17.2453 14.7467 16.9392 14.448C16.6331 14.1493 16.2533 14 15.8 14Z" fill={color}/>
  </Svg>
);

export const IconLelap = ({ color, width = 27, height = 27 }: { color?: string; width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 27 27" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12.734 0.00205254C13.7682 -0.058397 14.2854 1.23128 13.496 1.9022C11.6659 3.45756 10.5922 5.72874 10.5922 8.17698C10.5922 12.7227 14.2773 16.4078 18.823 16.4078C21.2713 16.4078 23.5424 15.334 25.0978 13.504C25.768 12.7154 27.0565 13.2307 26.9981 14.264C26.5951 21.3944 20.6831 27 13.5101 27C6.04867 27 0 20.9513 0 13.4899C0 6.35911 5.54189 0.468175 12.6228 0.00856303L12.6298 0.00812449L12.734 0.00205254ZM9.99678 2.69226L9.85807 2.7382C5.36692 4.26203 2.15891 8.51741 2.15891 13.4899C2.15891 19.759 7.24099 24.8411 13.5101 24.8411C18.512 24.8411 22.7846 21.5962 24.2862 17.0687L24.3073 17.0034L24.3036 17.0058C22.712 17.9952 20.8585 18.5493 18.9156 18.5663L18.823 18.5667C13.0849 18.5667 8.43325 13.9151 8.43325 8.17698C8.43325 6.20039 8.98904 4.3132 9.99418 2.69648L9.99678 2.69226Z" fill={color}/>
  </Svg>
);

export const IconAlam = ({ color, width = 24, height = 30 }: { color?: string; width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 24 30" fill="none">
    <Path d="M10.5 27V21H7.5C5.425 21 3.6565 20.2685 2.1945 18.8055C0.7325 17.3425 0.001 15.574 0 13.5C0 12 0.4125 10.619 1.2375 9.35699C2.0625 8.09499 3.175 7.176 4.575 6.6C4.8 4.725 5.619 3.1565 7.032 1.8945C8.445 0.632501 10.101 0.00100118 12 1.18577e-06C13.899 -0.000998813 15.5555 0.630501 16.9695 1.8945C18.3835 3.1585 19.202 4.727 19.425 6.6C20.825 7.175 21.9375 8.094 22.7625 9.35699C23.5875 10.62 24 12.001 24 13.5C24 15.575 23.2685 17.344 21.8055 18.807C20.3425 20.27 18.574 21.001 16.5 21H13.5V27H21C21.425 27 21.7815 27.144 22.0695 27.432C22.3575 27.72 22.501 28.076 22.5 28.5C22.499 28.924 22.355 29.2805 22.068 29.5695C21.781 29.8585 21.425 30.002 21 30H3C2.575 30 2.219 29.856 1.932 29.568C1.645 29.28 1.501 28.924 1.5 28.5C1.499 28.076 1.643 27.72 1.932 27.432C2.221 27.144 2.577 27 3 27H10.5ZM7.5 18H16.5C17.75 18 18.8125 17.5625 19.6875 16.6875C20.5625 15.8125 21 14.75 21 13.5C21 12.6 20.7435 11.775 20.2305 11.025C19.7175 10.275 19.049 9.72499 18.225 9.37499L16.65 8.7L16.425 6.975C16.275 5.85 15.7815 4.906 14.9445 4.143C14.1075 3.38 13.126 2.999 12 3C10.874 3.001 9.8925 3.3825 9.0555 4.1445C8.2185 4.9065 7.725 5.85 7.575 6.975L7.35 8.7L5.775 9.37499C4.95 9.72499 4.2815 10.275 3.7695 11.025C3.2575 11.775 3.001 12.6 3 13.5C3 14.75 3.4375 15.8125 4.3125 16.6875C5.1875 17.5625 6.25 18 7.5 18Z" fill={color}/>
  </Svg>
);

export const IconFokus = ({ color, width = 31, height = 31 }: { color?: string; width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 31 31" fill="none">
    <Path d="M15.5 27.9C18.7887 27.9 21.9427 26.5936 24.2681 24.2681C26.5936 21.9427 27.9 18.7887 27.9 15.5C27.9 12.2113 26.5936 9.05733 24.2681 6.73188C21.9427 4.40642 18.7887 3.1 15.5 3.1C12.2113 3.1 9.05733 4.40642 6.73188 6.73188C4.40642 9.05733 3.1 12.2113 3.1 15.5C3.1 18.7887 4.40642 21.9427 6.73188 24.2681C9.05733 26.5936 12.2113 27.9 15.5 27.9ZM15.5 31C6.93935 31 0 24.0606 0 15.5C0 6.93935 6.93935 0 15.5 0C24.0606 0 31 6.93935 31 15.5C31 24.0606 24.0606 31 15.5 31ZM15.5 21.7C17.1443 21.7 18.7213 21.0468 19.8841 19.8841C21.0468 18.7213 21.7 17.1443 21.7 15.5C21.7 13.8557 21.0468 12.2787 19.8841 11.1159C18.7213 9.95321 17.1443 9.3 15.5 9.3C13.8557 9.3 12.2787 9.95321 11.1159 11.1159C9.95321 12.2787 9.3 13.8557 9.3 15.5C9.3 17.1443 9.95321 18.7213 11.1159 19.8841C12.2787 21.0468 13.8557 21.7 15.5 21.7ZM15.5 24.8C13.0335 24.8 10.668 23.8202 8.92391 22.0761C7.17982 20.332 6.2 17.9665 6.2 15.5C6.2 13.0335 7.17982 10.668 8.92391 8.92391C10.668 7.17982 13.0335 6.2 15.5 6.2C17.9665 6.2 20.332 7.17982 22.0761 8.92391C23.8202 10.668 24.8 13.0335 24.8 15.5C24.8 17.9665 23.8202 20.332 22.0761 22.0761C20.332 23.8202 17.9665 24.8 15.5 24.8ZM15.5 18.6C14.6778 18.6 13.8893 18.2734 13.308 17.692C12.7266 17.1107 12.4 16.3222 12.4 15.5C12.4 14.6778 12.7266 13.8893 13.308 13.308C13.8893 12.7266 14.6778 12.4 15.5 12.4C16.3222 12.4 17.1107 12.7266 17.692 13.308C18.2734 13.8893 18.6 14.6778 18.6 15.5C18.6 16.3222 18.2734 17.1107 17.692 17.692C17.1107 18.2734 16.3222 18.6 15.5 18.6Z" fill={color}/>
  </Svg>
);

const BannerOrnaments = () => (
  <>
    {/* Ellipses */}
    <View className="absolute bg-[#FFEEBB] w-[53px] h-[53px] rounded-full left-[164px] top-[117px]" />
    <View className="absolute bg-[#F3C1CD] w-[53px] h-[53px] rounded-full left-[-22px] top-[107px]" />
    <View className="absolute bg-[#F3C1CD] w-[34px] h-[34px] rounded-full left-[207px] top-[55px]" />
    <View className="absolute bg-[#FFFFFF] w-[19px] h-[19px] rounded-full left-[149px] top-[15px]" />
    <View className="absolute bg-[#FFEEBB] w-[42px] h-[42px] rounded-full left-[35px] top-[-27px]" />
    
    {/* Stars */}
    <View className="absolute left-[95px] top-[117px]" style={{ transform: [{ rotate: '30deg' }] }}><StarWhiteIcon size={10} /></View>
    <View className="absolute left-[83px] top-[35px]" style={{ transform: [{ rotate: '97deg' }] }}><StarWhiteIcon size={6} /></View>
    <View className="absolute left-[242px] top-[25px]" style={{ transform: [{ rotate: '30deg' }] }}><StarWhiteIcon size={6} /></View>
    <View className="absolute left-[198px] top-[40px]" style={{ transform: [{ rotate: '-37deg' }] }}><StarWhiteIcon size={7} /></View>
    <View className="absolute left-[218px] top-[107px]" style={{ transform: [{ rotate: '62deg' }] }}><StarWhiteIcon size={8} /></View>
    <View className="absolute right-[20px] top-[11px]" style={{ transform: [{ rotate: '62deg' }] }}><StarWhiteIcon size={8} /></View>
  </>
);

const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'rileks', label: 'Rileks' },
  { id: 'lelap', label: 'Lelap' },
  { id: 'alam', label: 'Alam' },
  { id: 'fokus', label: 'Fokus' },
];

export const CARDS = [
  {
    id: 'kedamaian-batin',
    category: 'rileks',
    title: 'Kedamaian Batin',
    subtitle: 'Rehat sejenak dari bising dunia',
    color: '#6CBAB9',
    height: 243,
    image: mascotHugHeart,
    icon: <IconRileks color="white" width={16} height={16} />,
    imageStyle: 'w-full h-[120px]',
    imageContainerStyle: '-mt-2 mb-2',
  },
  {
    id: 'motivasi',
    category: 'fokus',
    title: 'Motivasi',
    subtitle: 'Langkah kecil penuh arti',
    color: '#FFA047',
    height: 223,
    image: mascotMotivated,
    icon: <IconFokus color="white" width={16} height={16} />,
    imageStyle: 'w-[120%] h-[120px]',
    imageContainerStyle: '-mt-2 mb-2',
  },
  {
    id: 'kicau-pagi',
    category: 'alam',
    title: 'Kicau Pagi',
    subtitle: 'Sambut hari tanpa beban',
    color: '#285CB9',
    height: 226,
    image: mascotMorning,
    icon: <IconAlam color="white" width={16} height={16} />,
    imageStyle: 'w-[140%] h-[130px] -ml-4',
    imageContainerStyle: '-mt-2 mb-2',
  },
  {
    id: 'kehangatan',
    category: 'lelap',
    title: 'Kehangatan',
    subtitle: 'Rasa aman dalam dekapan',
    color: '#E4B2B8',
    height: 246,
    image: mascotBlanket,
    icon: <IconLelap color="white" width={16} height={16} />,
    imageStyle: 'w-[110%] h-[120px]',
    imageContainerStyle: '-mt-2 mb-2',
  },
];

export default function MeditationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('semua');

  const renderIcon = (id: string, isActive: boolean) => {
    const color = isActive ? '#FFFFFF' : '#999999';
    const size = 26;
    if (id === 'semua') return <IconSemua color={color} width={size} height={size} />;
    if (id === 'rileks') return <IconRileks color={color} width={size} height={size} />;
    if (id === 'lelap') return <IconLelap color={color} width={size} height={size} />;
    if (id === 'alam') return <IconAlam color={color} width={size} height={size} />;
    if (id === 'fokus') return <IconFokus color={color} width={size} height={size} />;
    return null;
  };

  const filteredCards = CARDS.filter(c => activeCategory === 'semua' || c.category === activeCategory);
  const leftColumn = filteredCards.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredCards.filter((_, i) => i % 2 === 1);

  const renderCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push({ pathname: '/player', params: { title: item.title, category: item.category } })}
      activeOpacity={0.9}
      className="w-full rounded-[20px] p-4 mb-4 overflow-hidden justify-between"
      style={{ height: item.height, backgroundColor: item.color }}
    >
      <View className={`flex-1 items-center justify-center ${item.imageContainerStyle}`}>
        <Image source={item.image} className={item.imageStyle} resizeMode="contain" />
      </View>
      <View>
        <Text className="font-jakarta-bold text-[16px] text-white mb-1">{item.title}</Text>
        <Text className="font-jakarta-regular text-[12px] text-white opacity-90 mb-3" numberOfLines={2}>
          {item.subtitle}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {item.icon}
            <Text className="font-jakarta-medium text-[13px] text-white ml-1 capitalize">{item.category}</Text>
          </View>
          <View className="bg-white w-[24px] h-[24px] rounded-full items-center justify-center">
            <PlayIcon color={item.color} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FFFDF0]">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 flex-row items-center">
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/(tabs)');
              }
            }} 
            className="p-2 -ml-2 mr-3"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="bg-[#D7385E] w-12 h-12 rounded-[14px] items-center justify-center mr-3">
            <MaterialCommunityIcons name="meditation" size={28} color="white" />
          </View>
          <View>
            <Text className="font-jakarta-bold text-[22px] text-black">Meditasi</Text>
            <Text className="font-jakarta-regular text-[13px] text-[#999999]">
              Istirahatlah, Biarkan Musik Menjagamu
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-[#EAEAEA] mx-6 mb-6" />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mb-8"
          contentContainerStyle={{ paddingRight: 40 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className="items-center mr-5"
              >
                <View
                  className={`w-14 h-14 rounded-[12px] items-center justify-center mb-2 ${
                    isActive ? 'bg-[#D7385E]' : 'bg-[#EAEAEA]'
                  }`}
                >
                  {renderIcon(cat.id, isActive)}
                </View>
                <Text
                  className={`font-jakarta-regular text-[14px] ${
                    isActive ? 'text-black font-jakarta-semibold' : 'text-[#999999]'
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Banner */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-[#132B56] w-full h-[145px] rounded-[16px] overflow-hidden justify-center relative"
          >
            <BannerOrnaments />
            
            <View className="z-10 pl-[23px]">
              <Text className="font-jakarta-bold text-[20px] text-white leading-tight mb-1">
                Ruang Tenangmu
              </Text>
              <Text className="font-jakarta-regular text-[12px] text-white">
                Tempat pikiranmu beristirahat
              </Text>
            </View>

            <Image
              source={mascotHoldHeart}
              className="absolute right-0 bottom-[-5px] w-[140px] h-[155px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Grid Cards - Masonry Layout */}
        <View className="px-6 flex-row justify-between">
          
          {/* Left Column */}
          <View className="w-[47%]">
            {leftColumn.map(renderCard)}
          </View>

          {/* Right Column */}
          <View className="w-[47%]">
            {rightColumn.map(renderCard)}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
