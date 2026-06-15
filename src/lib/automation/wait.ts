export function waitForElement<T extends Element>(
  selector: string,
  timeout = 10_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<T>(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector<T>(selector);
      if (element) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(element);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    const timer = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found: ${selector}`));
    }, timeout);
  });
}

export function waitForCondition<T>(
  fn: () => T | undefined | null | false,
  timeout = 10_000,
  interval = 100,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const result = fn();
      if (result) {
        resolve(result);
        return;
      }

      if (Date.now() - start > timeout) {
        reject(new Error("Condition timed out"));
        return;
      }

      window.setTimeout(check, interval);
    };

    check();
  });
}

export async function waitForStableDom(stableMs = 150) {
  await new Promise<void>((resolve) => {
    let timer: number;

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(finish, stableMs);
    });

    function finish() {
      observer.disconnect();
      resolve();
    }

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    timer = window.setTimeout(finish, stableMs);
  });
}
