import React, { useEffect, useState } from 'react';
import { dataApi } from '../utils/dataApi';
import { fsId, isFsRef } from '../utils/imageRefs';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

function load(ref: string): Promise<string | null> {
  const hit = cache.get(ref);
  if (hit) return Promise.resolve(hit);
  let p = inflight.get(ref);
  if (!p) {
    p = dataApi
      .getImage(fsId(ref))
      .then((url) => {
        if (url) cache.set(ref, url);
        return url;
      })
      .catch(() => null)
      .finally(() => inflight.delete(ref));
    inflight.set(ref, p);
  }
  return p;
}

/** 서버에 올린 사진('fs:번호')은 필요할 때 불러와서 보여주고, 일반 주소는 그대로 보여줍니다. */
export const ResolvedImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { src?: string }> = ({
  src,
  alt = '',
  ...rest
}) => {
  const [resolved, setResolved] = useState<string | undefined>(() =>
    isFsRef(src) ? cache.get(src) : src,
  );
  useEffect(() => {
    if (!isFsRef(src)) {
      setResolved(src);
      return;
    }
    const hit = cache.get(src);
    if (hit) {
      setResolved(hit);
      return;
    }
    setResolved(undefined);
    let alive = true;
    load(src).then((url) => {
      if (alive && url) setResolved(url);
    });
    return () => {
      alive = false;
    };
  }, [src]);
  return <img {...rest} src={resolved || BLANK} alt={alt} data-loaded={resolved ? '1' : '0'} />;
};
