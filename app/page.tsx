'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { RotateCcw, Search, ShoppingCart, Star } from 'lucide-react';

const SESSION_KEY = 'fix-price-address-demo';
const STORIES = [
  { src: '/story-point.svg', label: 'История 1' },
  { src: '/story-1.svg', label: 'История 2' },
  { src: '/story-2.svg', label: 'История 3' },
  { src: '/story-3.svg', label: 'История 4' },
];
const NEW_PRODUCTS = [
  { price: '35 ₽', title: 'Мармелад жевательный…', rating: '4,5 (99+)' },
  { price: '129 ₽', title: 'Шоколадный батончик с орехами', rating: '4,8 (54)' },
  { price: '89 ₽', title: 'Печенье с начинкой клубника', rating: '4,7 (31)' },
  { price: '199 ₽', title: 'Набор фруктовых пастилок', rating: '4,9 (18)' },
];
const NAV_ITEMS = [
  { label: 'Главная', icon: '/nav-home.svg' },
  { label: 'Каталог', icon: '/nav-catalog.svg' },
  { label: 'Карта', icon: '/nav-map.svg', badge: true },
  { label: 'Магазины', icon: '/nav-stores.svg' },
  { label: 'Профиль', icon: '/nav-profile.svg' },
];

export default function Home() {
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>([]);
  const [isStoriesDragging, setIsStoriesDragging] = useState(false);
  const [isProductsDragging, setIsProductsDragging] = useState(false);
  const activeNavItem = 'Главная';
  const [screen, setScreen] = useState<'home' | 'map'>('home');
  const [isMapClosing, setIsMapClosing] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup' | 'self'>('delivery');
  const [address, setAddress] = useState('');
  const storiesRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const storiesDrag = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  });
  const productsDrag = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  });

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ addresses: [], createdAt: new Date().toISOString() }),
      );
    }
  }, []);

  function resetDemo() {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ addresses: [], createdAt: new Date().toISOString() }),
    );
    setFavoriteProductIds([]);
    setScreen('home');
    setIsMapClosing(false);
    setDeliveryMode('delivery');
    setAddress('');
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    if (storiesRef.current) storiesRef.current.scrollLeft = 0;
    if (productsRef.current) productsRef.current.scrollLeft = 0;
    if (searchRef.current) searchRef.current.value = '';
  }

  function startStoriesDrag(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !storiesRef.current) {
      return;
    }

    storiesDrag.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: storiesRef.current.scrollLeft,
    };
    storiesRef.current.setPointerCapture(event.pointerId);
    setIsStoriesDragging(true);
  }

  function moveStoriesDrag(event: ReactPointerEvent<HTMLElement>) {
    const scroller = storiesRef.current;
    const drag = storiesDrag.current;

    if (!scroller || !drag.active || event.pointerId !== drag.pointerId) {
      return;
    }

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 3) {
      drag.moved = true;
    }

    if (drag.moved) {
      event.preventDefault();
      scroller.scrollLeft = drag.scrollLeft - distance;
    }
  }

  function stopStoriesDrag(event: ReactPointerEvent<HTMLElement>) {
    const scroller = storiesRef.current;
    const drag = storiesDrag.current;

    if (!drag.active || event.pointerId !== drag.pointerId) {
      return;
    }

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    drag.active = false;
    setIsStoriesDragging(false);
  }

  function blockStoryClickAfterDrag(event: ReactMouseEvent<HTMLElement>) {
    if (!storiesDrag.current.moved) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    storiesDrag.current.moved = false;
  }

  function startProductsDrag(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !productsRef.current) {
      return;
    }

    productsDrag.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: productsRef.current.scrollLeft,
    };
    productsRef.current.setPointerCapture(event.pointerId);
    setIsProductsDragging(true);
  }

  function moveProductsDrag(event: ReactPointerEvent<HTMLElement>) {
    const scroller = productsRef.current;
    const drag = productsDrag.current;

    if (!scroller || !drag.active || event.pointerId !== drag.pointerId) {
      return;
    }

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 3) {
      drag.moved = true;
    }

    if (drag.moved) {
      event.preventDefault();
      scroller.scrollLeft = drag.scrollLeft - distance;
    }
  }

  function stopProductsDrag(event: ReactPointerEvent<HTMLElement>) {
    const scroller = productsRef.current;
    const drag = productsDrag.current;

    if (!drag.active || event.pointerId !== drag.pointerId) {
      return;
    }

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    drag.active = false;
    setIsProductsDragging(false);
  }

  function blockProductClickAfterDrag(event: ReactMouseEvent<HTMLElement>) {
    if (!productsDrag.current.moved) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    productsDrag.current.moved = false;
  }

  return (
    <main className="prototype-stage">
      <section className="android-device" aria-label="Android-прототип 360 на 800 пикселей">
        <div className="android-status" aria-label="Строка состояния Android">
          <time>12:00</time>
          <span aria-hidden="true">● ◒ ▰</span>
        </div>

        {screen === 'map' ? (
          <section className={`map-screen ${isMapClosing ? 'is-closing' : ''}`} aria-label="Выбор способа получения">
            <div className="map-canvas">
              <button type="button" className="map-back" aria-label="Назад" onClick={() => { setIsMapClosing(true); window.setTimeout(() => { setScreen('home'); setIsMapClosing(false); }, 260); }}><img src="/figma-arrow-left.svg" alt="" /></button>
              <img className="map-center-pin" src="/figma-map-pin.svg" alt="" />
              <div className="map-controls"><button type="button" aria-label="Увеличить"><img src="/figma-plus.svg" alt="" /></button><button type="button" aria-label="Уменьшить"><img src="/figma-minus.svg" alt="" /></button><button type="button" aria-label="Моё местоположение"><img src="/figma-navigation.svg" alt="" /></button></div>
            </div>
            <div className="map-sheet"><div className="map-sheet-handle" />
              <div className="delivery-options">
                {[
                  ['delivery', 'Доставка', '/van.png'],
                  ['pickup', 'Пункт выдачи', '/pvz.png'],
                  ['self', 'Самовывоз', '/store.png'],
                ].map(([value, label, image]) => (
                  <button key={value} type="button" disabled={value !== 'delivery'} className={`delivery-option ${deliveryMode === value ? 'is-selected' : ''}`} onClick={() => setDeliveryMode(value as typeof deliveryMode)}>
                    <span>{value === 'pickup' ? <>Пункт<br />выдачи</> : label}</span><img src={image} alt="" />
                  </button>
                ))}
              </div>
              <h1>Укажите адрес</h1><p>Повлияет на ассортимент, цены и акции</p>
              <div className="address-field"><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Определяем адрес..." aria-label="Адрес" /><button type="button" aria-label="Продолжить"><img src="/placeholder.svg" alt="" /></button></div>
              <button type="button" className="map-submit" disabled={!address.trim()}><span className="map-loader" aria-hidden="true" /></button>
            </div>
          </section>
        ) : <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-20 bg-[#FAFAFA]">
            <button
              type="button"
              className="flex h-[42px] w-full items-center justify-start gap-0 px-4 text-[14px] font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#81BB3C]"
              aria-label="Выбрать способ получения: доставка или самовывоз"
              onClick={() => setScreen('map')}
            >
              <span className="min-w-0 flex-1 text-left">Выберите: доставка или самовывоз</span>
              <svg
                aria-hidden="true"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 17L14.5 12L9.5 7"
                  stroke="#81BB3C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </header>

          <div className="flex h-[52px] flex-none items-center gap-3 bg-[#FAFAFA] px-4">
            <div className="flex h-9 min-w-0 flex-1 items-center rounded-[8px] border border-[#81BB3C] bg-white pl-3 focus-within:outline-none">
              <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                type="search"
                aria-label="Поиск"
                placeholder="Поиск"
                className="h-full min-w-0 flex-1 bg-transparent pl-2 pr-3 text-[17px] font-normal outline-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="button"
              className="inline-flex size-6 shrink-0 items-center justify-center p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
              aria-label="Избранное"
            >
              <svg
                aria-hidden="true"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21L12 17.5L5 21V6C5 5.46957 5.21071 4.96086 5.58579 4.58579C5.96086 4.21071 6.46957 4 7 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V21Z"
                  stroke="#2F2F2F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="inline-flex size-6 shrink-0 items-center justify-center p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
              aria-label="Уведомления"
            >
              <svg
                aria-hidden="true"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4004 8.63844C18.4004 6.98349 17.7261 5.39632 16.5259 4.22609C15.3256 3.05586 13.6978 2.39844 12.0004 2.39844C10.303 2.39844 8.67514 3.05586 7.47491 4.22609C6.27467 5.39632 5.60039 6.98349 5.60039 8.63844C5.60039 12.1647 4.84959 14.471 4.07534 15.9117C3.69838 16.6132 4.30274 17.9984 5.09908 17.9984H18.9017C19.698 17.9984 20.3024 16.6132 19.9254 15.9117C19.1512 14.471 18.4004 12.1647 18.4004 8.63844Z"
                  stroke="#2F2F2F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.3996 20.3984C14.1557 20.7634 13.8056 21.0664 13.3844 21.277C12.9632 21.4876 12.4857 21.5984 11.9996 21.5984C11.5135 21.5984 11.036 21.4876 10.6148 21.277C10.1936 21.0664 9.84351 20.7634 9.59961 20.3984"
                  stroke="#2F2F2F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-none px-4 pt-2">
            <img
              src="/promo-banner.png"
              alt="Промобаннер: знакомьтесь, Фокс!"
              width="656"
              height="332"
              className="block h-auto w-full rounded-[16px]"
            />
          </div>

          <section
            ref={storiesRef}
            aria-label="Истории"
            className={`mt-6 flex-none touch-pan-x select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isStoriesDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onPointerDown={startStoriesDrag}
            onPointerMove={moveStoriesDrag}
            onPointerUp={stopStoriesDrag}
            onPointerCancel={stopStoriesDrag}
            onClickCapture={blockStoryClickAfterDrag}
          >
            <div className="flex w-max gap-2 px-4">
              {STORIES.map((story, index) => (
                <button
                  key={story.src}
                  type="button"
                  className="size-[100px] shrink-0 overflow-hidden rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
                  aria-label={story.label}
                >
                  <img
                    src={story.src}
                    alt=""
                    width="100"
                    height="100"
                    draggable="false"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="block size-[100px]"
                  />
                </button>
              ))}
            </div>
          </section>

          <section
            aria-label="Быстрые действия"
            className="mt-6 grid h-[72px] flex-none grid-cols-3 gap-1 px-4"
          >
            {[
              { label: 'Копи кристаллы', src: '/action-crystals.png' },
              { label: 'Акции', src: '/action-sales.svg' },
              { label: 'Спец. цена', src: '/action-special-price.svg' },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                aria-label={action.label}
                className="h-[72px] min-w-0 overflow-hidden rounded-[16px] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
              >
                <img
                  src={action.src}
                  alt=""
                  width="107"
                  height="72"
                  draggable="false"
                  className="block h-[72px] w-full"
                />
              </button>
            ))}
          </section>

          <section aria-labelledby="new-products-title" className="mt-6 flex-none">
            <div className="flex items-center justify-between px-4">
              <h2 id="new-products-title" className="text-[19px] font-medium leading-6 text-foreground">
                Новинки
              </h2>
              <button
                type="button"
                className="text-[16px] font-medium leading-5 text-[#3C7BE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C7BE0]"
              >
                Все
              </button>
            </div>

            <div
              ref={productsRef}
              className={`mt-4 -mb-2 flex-none touch-pan-x select-none overflow-x-auto px-4 pb-2 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isProductsDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onPointerDown={startProductsDrag}
              onPointerMove={moveProductsDrag}
              onPointerUp={stopProductsDrag}
              onPointerCancel={stopProductsDrag}
              onClickCapture={blockProductClickAfterDrag}
            >
              <div className="flex w-max gap-3">
                {NEW_PRODUCTS.map((product, index) => {
                  const isFavorite = favoriteProductIds.includes(index);

                  return (
                    <article
                      key={product.title}
                      className="box-border flex h-[330px] w-[166px] flex-none flex-col rounded-[8px] bg-card p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative h-[185px] w-[150px] overflow-hidden rounded-[8px] bg-muted">
                        <img
                          src="/product-image.png"
                          alt={product.title}
                          width="150"
                          height="185"
                          draggable="false"
                          className="block h-[185px] w-[150px] object-cover"
                        />
                        <button
                          type="button"
                          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                          aria-pressed={isFavorite}
                          className="absolute right-0.5 top-0.5 inline-flex size-6 items-center justify-center rounded-[8px] bg-transparent p-0 text-[#2F2F2F] transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#81BB3C]"
                          onClick={() =>
                            setFavoriteProductIds((ids) =>
                              isFavorite ? ids.filter((id) => id !== index) : [...ids, index],
                            )
                          }
                        >
                          <img
                            src="/fav.svg"
                            alt=""
                            width="24"
                            height="24"
                            draggable="false"
                            className="block size-6"
                          />
                        </button>
                      </div>

                      <p className="mt-2 text-[16px] font-bold leading-5 text-foreground">{product.price}</p>
                      <p className="mt-1 truncate text-[12px] font-normal leading-4 text-foreground">
                        {product.title}
                      </p>
                      <div className="mt-1 flex h-5 items-center gap-1 text-[12px] font-normal leading-4 text-muted-foreground">
                        <Star aria-hidden="true" className="size-4 shrink-0 text-[#FFD429]" fill="#FFD429" />
                        <span>{product.rating}</span>
                      </div>

                      <button
                        type="button"
                        className="mt-auto inline-flex h-8 w-[150px] items-center justify-center gap-2 rounded-[8px] bg-[#81BB3C] px-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#71a934] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
                        aria-label={`Добавить в корзину: ${product.title}`}
                      >
                        <ShoppingCart aria-hidden="true" className="size-5 shrink-0" />
                        <span>В корзину</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          </div>
        </div>}

        {screen === 'home' && <nav className="android-navbar" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNavItem === item.label;
            return (
              <button
                key={item.label}
                type="button"
                className="android-navbar-item"
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
                disabled={!isActive}
              >
                <span className={`android-navbar-icon ${item.badge ? 'android-navbar-icon-badge' : ''}`}>
                  <img src={item.icon} alt="" width="24" height="24" draggable="false" />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>}

        <div className="android-navigation" aria-label="Системная навигация Android">
          <span aria-hidden="true" />
        </div>
      </section>

      <div className="prototype-reset">
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81BB3C]"
          onClick={resetDemo}
        >
          <RotateCcw aria-hidden="true" />
          Сбросить демо
        </button>
      </div>
    </main>
  );
}
